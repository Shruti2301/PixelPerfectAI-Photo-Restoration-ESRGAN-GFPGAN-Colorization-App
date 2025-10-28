
# server/app.py
# =============================================================
# AI Model Worker Service (Flask)
# -------------------------------------------------------------
# This service is responsible for handling heavy computational tasks:
# 1. Loading and running pre-trained H5 deep learning models (SRCNN, Sharpening).
# 2. Receiving image processing jobs via an API endpoint (`/process_job`).
# 3. Running the job asynchronously in a background thread.
# 4. Calculating image quality metrics (PSNR, SSIM, MSE).
# 5. Persisting job progress and final results (including Base64 image data)
#    directly to the PostgreSQL `enhancements` table.
# =============================================================
# Author: Shruti Mandaokar
# Date: October 2025

import os
import numpy as np
import cv2
from flask import Flask, request, jsonify
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D
from skimage.metrics import peak_signal_noise_ratio as calculate_psnr, structural_similarity as calculate_ssim
from PIL import Image
from flask_cors import CORS # Successfully imported
import io
import base64
import psycopg2 # ADDED: PostgreSQL library for DB updates
import threading # ADDED: For running the heavy task in the background
import time # For simulating work progress

# --- 0. CONFIGURATION & UTILITY FUNCTIONS ---

# IMPORTANT: Set your NeonDB URL here. It should be available in your environment variables.
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    # Fallback/Error reporting (Node.js will also need this ENV)
    print("!!! CRITICAL: DATABASE_URL environment variable is not set. DB updates will fail.")

def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection failed: {e}")
        return None

def update_progress(job_id, status, progress=None, enhanced_url=None, psnr_val=None, ssim_val=None, mae_val=None, enhanced_resolution=None):
    """Updates the status and progress in the enhancements table."""
    if not DATABASE_URL:
        return
        
    conn = get_db_connection()
    if not conn:
        return

    cursor = conn.cursor()
    try:
        # NOTE: PostgreSQL NUMERIC columns (psnr, ssim, mae) are safe with Python strings/floats.
        query = """
            UPDATE enhancements 
            SET status = %s, 
                processing_progress = %s, 
                enhanced_image_url = %s,
                psnr = %s,
                ssim = %s,
                mae = %s,
                enhanced_resolution = %s
            WHERE id = %s
        """
        
        progress_val = int(progress) if progress is not None else None
        
        cursor.execute(query, (
            status, 
            progress_val, 
            enhanced_url, 
            str(psnr_val) if psnr_val is not None else None,
            str(ssim_val) if ssim_val is not None else None,
            str(mae_val) if mae_val is not None else None,
            enhanced_resolution,
            job_id
        ))
        conn.commit()
        print(f"DB updated for {job_id}: Status={status}, Progress={progress}")
    except Exception as e:
        print(f"Error updating DB for job {job_id}: {e}")
    finally:
        cursor.close()
        conn.close()

# --- Utility Functions (Kept for brevity, assume original functions are here) ---

def resize_image_max_dim(img_np_float, max_dim=1024):
    """Resizes image if its height or width exceeds max_dim to prevent OOM errors."""
    h, w, _ = img_np_float.shape
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        
        img_uint8 = (img_np_float * 255.0).astype(np.uint8)
        img_pil = Image.fromarray(img_uint8)
        img_pil_resized = img_pil.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        print(f"Image resized from {w}x{h} to {new_w}x{new_h} for memory safety.")
        return np.array(img_pil_resized).astype(np.float32) / 255.0
    return img_np_float

def mse(img1, img2):
    """Mean Squared Error (L2 Loss)."""
    h1, w1, _ = img1.shape
    h2, w2, _ = img2.shape
    
    if (h1, w1) != (h2, w2):
        img2_resized = cv2.resize(img2, (w1, h1), interpolation=cv2.INTER_LINEAR)
        return np.mean((img1 - img2_resized) ** 2)
    
    return np.mean((img1 - img2) ** 2)

def psnr(original_img, enhanced_img):
    """Peak Signal-to-Noise Ratio (PSNR)"""
    h_orig, w_orig, _ = original_img.shape
    enhanced_img_resized = cv2.resize(enhanced_img, (w_orig, h_orig), interpolation=cv2.INTER_LINEAR)
    return calculate_psnr(original_img, enhanced_img_resized, data_range=1.0)

def ssim(original_img, enhanced_img):
    """Structural Similarity Index (SSIM)"""
    h_orig, w_orig, _ = original_img.shape
    enhanced_img_resized = cv2.resize(enhanced_img, (w_orig, h_orig), interpolation=cv2.INTER_LINEAR)
    return calculate_ssim(original_img, enhanced_img_resized, channel_axis=-1, data_range=1.0)

# --- 1. MODEL ARCHITECTURE DEFINITIONS (Unchanged) ---
# ... (build_srcnn_3_layer, build_sharpening_model remain the same) ...
def build_srcnn_3_layer(input_channels=3, output_channels=3):
    """3-layer SRCNN architecture for Super-Resolution and Colorization."""
    model = Sequential([
        Conv2D(64, kernel_size=(9, 9), activation='relu', padding='same', input_shape=(None, None, input_channels)),
        Conv2D(32, kernel_size=(1, 1), activation='relu', padding='same'),
        Conv2D(output_channels, kernel_size=(5, 5), activation='linear', padding='same')
    ])
    return model

def build_sharpening_model(input_channels=1, output_channels=2):
    """4-layer model used for Sharpening."""
    model = Sequential([
        Conv2D(64, kernel_size=(9, 9), activation='relu', padding='same', input_shape=(None, None, input_channels)),
        Conv2D(32, kernel_size=(1, 1), activation='relu', padding='same'), 
        Conv2D(32, kernel_size=(3, 3), activation='relu', padding='same'), 
        Conv2D(output_channels, kernel_size=(5, 5), activation='linear', padding='same') 
    ])
    return model

# --- 2. LOAD MODELS AND WEIGHTS (Unchanged) ---

MODELS = {}
ARCHITECTURES = {
    'superresolution': build_srcnn_3_layer(input_channels=3),
    'colorization': build_srcnn_3_layer(input_channels=3, output_channels=3),
    'sharpening': build_sharpening_model(input_channels=1, output_channels=2)
}
WEIGHTS = {
    'superresolution': 'best_val_psnr.h5',
    'colorization': 'best_val_mae.h5',
    'sharpening': 'best_val_loss.h5'
}

try:
    for task, model in ARCHITECTURES.items():
        weights_file = WEIGHTS[task]
        if os.path.exists(weights_file):
            model.load_weights(weights_file)
            MODELS[task] = model
            print(f"Successfully loaded {task} model ({weights_file}) with {len(model.layers)} layers.")
        else:
            print(f"Weight file {weights_file} not found. Skipping {task} model.")

    if not MODELS:
        raise Exception("All model loads failed.")

except Exception as e:
    MODELS = {} 
    print(f"!!! CRITICAL ERROR: Could not load models. Error: {e}")


# --- 4. DEEP LEARNING IMAGE PROCESSING FUNCTIONS (Unchanged) ---

def super_resolution_deep_learning(img_np_float, scale_factor=2):
    h, w, _ = img_np_float.shape
    new_h, new_w = h * scale_factor, w * scale_factor
    img_uint8 = np.clip(img_np_float * 255.0, 0, 255).astype(np.uint8)
    img_bicubic_uint8 = cv2.resize(img_uint8, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
    img_input = img_bicubic_uint8.astype('float32') / 255.0
    img_input = np.expand_dims(img_input, axis=0)
    result_img_np_float = MODELS['superresolution'].predict(img_input, verbose=0)[0] 
    return result_img_np_float, scale_factor

def colorization_deep_learning(img_np_float):
    img_input = np.expand_dims(img_np_float, axis=0) 
    result_img_np_float_3ch = MODELS['colorization'].predict(img_input, verbose=0)[0]
    return result_img_np_float_3ch

def sharpening_deep_learning(img_np_float, alpha=0.9):
    img_uint8 = np.clip(img_np_float * 255.0, 0, 255).astype(np.uint8)
    ycrcb_img = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2YCrCb)
    y_channel_np_float = ycrcb_img[..., 0:1].astype(np.float32) / 255.0
    img_input = np.expand_dims(y_channel_np_float, axis=0)
    result_img_np_float_2ch = MODELS['sharpening'].predict(img_input, verbose=0)[0] 
    enhanced_y_model_output = np.clip(result_img_np_float_2ch[..., 0], 0.0, 1.0)
    original_y_flat = y_channel_np_float[..., 0]
    enhanced_y_channel_np_float = (alpha * enhanced_y_model_output) + \
                                  ((1.0 - alpha) * original_y_flat)
    enhanced_y_channel_np_float = np.clip(enhanced_y_channel_np_float, 0.0, 1.0)
    enhanced_y_channel_uint8 = (enhanced_y_channel_np_float * 255.0).astype(np.uint8)
    ycrcb_img_enhanced = np.dstack((
        enhanced_y_channel_uint8,
        ycrcb_img[..., 1],
        ycrcb_img[..., 2]
    ))
    final_rgb_uint8 = cv2.cvtColor(ycrcb_img_enhanced, cv2.COLOR_YCrCb2RGB)
    result_img_np_float_3ch = final_rgb_uint8.astype(np.float32) / 255.0
    return result_img_np_float_3ch


# --- 5. ASYNCHRONOUS JOB PROCESSING FUNCTION (MODIFIED) ---

def process_job_async(job_id, operation, img_data):
    """
    Runs the deep learning model and updates the database with progress/results.
    This function is run in a separate thread.
    """
    start_time = time.time()
    try:
        update_progress(job_id, "processing", 20) # Update 1
        
        # 1. Image Preparation
        img = Image.open(io.BytesIO(img_data)).convert("RGB")
        original_img_np_float = np.array(img).astype(np.float32) / 255.0
        resized_img_np_float = resize_image_max_dim(original_img_np_float, max_dim=1024) 

        # --- 2. Model Processing ---
        
        result_img_np_float = None
        scale_factor = 1.0

        if operation in ['superresolution', 'upscale_2x', 'upscale_4x']:
            update_progress(job_id, "processing", 40) # Update 2
            result_img_np_float, scale_factor = super_resolution_deep_learning(resized_img_np_float, scale_factor=2)
            update_progress(job_id, "processing", 70) # Update 3
        elif operation in ['colorization', 'enhance']:
            update_progress(job_id, "processing", 40) # Update 2
            result_img_np_float = colorization_deep_learning(resized_img_np_float)
            update_progress(job_id, "processing", 70) # Update 3
        elif operation in ['sharpening', 'denoise']: 
            update_progress(job_id, "processing", 40) # Update 2
            result_img_np_float = sharpening_deep_learning(resized_img_np_float)
            update_progress(job_id, "processing", 70) # Update 3
        else:
            raise ValueError(f"Invalid enhancement type: {operation}")

        result_img_np_float = np.clip(result_img_np_float, 0.0, 1.0)

        # --- 3. Finalization and Metrics ---

        # Metrics Calculation (90%)
        loss_val = mse(resized_img_np_float, result_img_np_float)
        psnr_val = psnr(resized_img_np_float, result_img_np_float) 
        ssim_val = ssim(resized_img_np_float, result_img_np_float)
        
        update_progress(job_id, "processing", 90) # Update 4

        # Prepare Image and encode as Base64 for DB storage
        final_result_uint8 = np.clip(result_img_np_float * 255.0, 0, 255).astype(np.uint8)
        result_img = Image.fromarray(final_result_uint8)
        byte_arr = io.BytesIO()
        result_img.save(byte_arr, format='PNG')
        
        # NOTE: Using data URI scheme for enhanced_image_url
        image_base64_url = "data:image/png;base64," + base64.b64encode(byte_arr.getvalue()).decode('utf-8')

        # Final DB Update (100% complete)
        enhanced_h, enhanced_w, _ = result_img_np_float.shape
        enhanced_resolution = f"{enhanced_w}x{enhanced_h}"

        update_progress(
            job_id, 
            "completed", 
            100, 
            enhanced_url=image_base64_url,
            psnr_val=psnr_val,
            ssim_val=ssim_val,
            mae_val=loss_val,
            enhanced_resolution=enhanced_resolution
        )
        print(f"Job {job_id} successfully completed in {time.time() - start_time:.2f}s and saved to DB.")

    except Exception as e:
        print(f"CRITICAL: Job {job_id} failed during processing: {e}")
        update_progress(job_id, "failed", 100)

# --- 3. FLASK APP SETUP & ENDPOINT (MODIFIED) ---

app = Flask(__name__)
CORS(app) # <--- ADDED: Fixes the 403 Cross-Origin/CSRF error

@app.route('/')
def index():
    return "AI Image Processing Server running. Use /api/enhancements/process_job for processing."

# ⭐️ NEW ENDPOINT: This receives the job from the Node.js server.
@app.route('/api/enhancements/process_job', methods=['POST'])
def process_job_endpoint():
    data = request.json
    job_id = data.get('jobId')
    operation = data.get('enhancementType')
    image_base64_data = data.get('imageFileBase64')

    if not job_id or not operation or not image_base64_data:
        return jsonify({"error": "Missing jobId, enhancementType, or imageFileBase64"}), 400

    try:
        # Decode the image data from Node.js
        img_data = base64.b64decode(image_base64_data)
    except Exception as e:
        return jsonify({"error": f"Invalid base64 image data: {e}"}), 400

    # Start the heavy processing in a new thread
    thread = threading.Thread(
        target=process_job_async, 
        args=(job_id, operation, img_data)
    )
    thread.start()
    
    # IMMEDIATE RESPONSE: Return 202 Accepted to the Node.js server
    return jsonify({
        "status": "Job accepted and started in background",
        "jobId": job_id
    }), 202


if __name__ == '__main__':
    # Flask app must run on a different port than the Node.js server (e.g., 5000)
    app.run(debug=True, port=5000)