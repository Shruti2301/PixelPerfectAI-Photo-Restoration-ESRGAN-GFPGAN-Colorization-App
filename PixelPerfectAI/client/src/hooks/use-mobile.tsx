// client/src/hooks/useIsMobile.ts
// ------------------------------------------------------------
// Hook Name: useIsMobile
// Description:
//   A custom React hook that determines whether the current
//   viewport width corresponds to a "mobile" screen size.
//
//   It listens for window resize events and updates reactively
//   when the viewport crosses the defined breakpoint.
//
// Author: Shruti Mandaokar
// Created: October 2025
// ------------------------------------------------------------

import * as React from "react"

// Define the breakpoint width (in pixels) for mobile screens
const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile
 * ------------
 * Custom hook that detects if the user's device is mobile-sized.
 *
 * @returns {boolean} - `true` if viewport width is below MOBILE_BREAKPOINT, else `false`.
 */
export function useIsMobile() {
  // State to store whether the device is mobile or not
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query for detecting viewport changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Function to update state based on current viewport width
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener to detect screen size changes
    mql.addEventListener("change", onChange)

    // Initial check when the component mounts
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup event listener when component unmounts
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return a boolean (defaults to false if undefined)
  return !!isMobile
}
