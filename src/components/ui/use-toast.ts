"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type { ToastProps } from "../../components/ui/toast"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

// Rest of the file remains unchanged
