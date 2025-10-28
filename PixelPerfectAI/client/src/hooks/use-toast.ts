// client/src/hooks/use-toast.ts
// -----------------------------------------------------------------------------
// Hook Name: useToast
// Description:
//   Provides a global toast notification system for React app. 
//   It manages toast state (add, update, dismiss, remove) with a reducer pattern
//   and exposes an easy-to-use hook (`useToast`) and function (`toast`).
//
//   Inspired by Radix UI Toast and ShadCN implementation patterns.
//
// Author: Shruti Mandaokar
// Created: October 2025
// -----------------------------------------------------------------------------

import * as React from "react"
// Ensure this path is correct and the components export valid types
import type { ToastActionElement, ToastProps } from "@/components/ui/toast" 

// Configuration constants
const TOAST_LIMIT = 1              // Maximum number of concurrent toasts
const TOAST_REMOVE_DELAY = 1000000 // Delay (in ms) before removing a dismissed toast

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/**
 * Type: ToasterToast
 * Extends ToastProps with unique identifiers and optional metadata
 */
type ToasterToast = ToastProps & {
  id: string
  // Ensure we use React.ReactNode for maximum compatibility with titles/descriptions
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * Action type constants
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0 // used to generate incremental unique toast IDs

/**
 * Generates a unique toast ID (cycles within safe integer range)
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

/**
 * Defines the structure of actions handled by the reducer
 */
type ActionType = typeof actionTypes
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

/**
 * Shape of the toast state
 */
interface State {
  toasts: ToasterToast[]
}

// -----------------------------------------------------------------------------
// INTERNAL STATE MANAGEMENT
// -----------------------------------------------------------------------------

// Timeout map for automatic toast removals
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Adds a toast to a timed removal queue
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Reducer function that handles toast lifecycle actions
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Add new toast (limit to TOAST_LIMIT)
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    // Update existing toast by ID
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    // Mark toast(s) as dismissed (soft close)
    case "DISMISS_TOAST": {
      const { toastId } = action

      // Queue toast(s) for removal after delay
      if (toastId) addToRemoveQueue(toastId)
      else state.toasts.forEach((t) => addToRemoveQueue(t.id))

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      }
    }

    // Permanently remove toast(s)
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// -----------------------------------------------------------------------------
// DISPATCH AND SUBSCRIPTION SYSTEM
// -----------------------------------------------------------------------------

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

/**
 * Dispatches an action and updates all active listeners
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

// -----------------------------------------------------------------------------
// TOAST CREATION FUNCTION
// -----------------------------------------------------------------------------

type Toast = Omit<ToasterToast, "id">

/**
 * Creates a new toast notification and returns its control functions
 *
 * @param props - Toast properties (title, description, etc.)
 * @returns {object} - Toast controller with `id`, `dismiss`, and `update`
 */
function toast({ ...props }: Toast) {
  const id = genId()

  // Helper functions for toast lifecycle control
  const update = (props: ToasterToast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Add the new toast
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return { id, dismiss, update }
}

// -----------------------------------------------------------------------------
// HOOK: useToast
// -----------------------------------------------------------------------------

/**
 * React hook that exposes the toast state and action handlers.
 *
 * @returns {object} - Toast state and control methods
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  // Subscribe to toast state updates
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, []) // Empty dependency array is the correct pattern for subscriptions

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

export { useToast, toast }