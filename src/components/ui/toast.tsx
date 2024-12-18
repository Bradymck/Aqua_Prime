"use client";

import * as React from "react";
import { ToastContainer as ToastifyContainer, toast as toastify, type ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export const Toaster = () => <ToastifyContainer {...defaultOptions} />;

export const toast = ({ message, type = 'info', duration = 3000 }: ToastProps) => {
  const options = { ...defaultOptions, autoClose: duration };
  
  switch (type) {
    case 'success':
      return toastify.success(message, options);
    case 'error':
      return toastify.error(message, options);
    case 'warning':
      return toastify.warning(message, options);
    default:
      return toastify.info(message, options);
  }
};
