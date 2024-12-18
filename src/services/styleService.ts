'use client'

import { type CSSProperties } from 'react'

export type StyleOptions = {
  theme?: 'light' | 'dark'
  accentColor?: string
  fontFamily?: string
}

export class StyleService {
  private static instance: StyleService | null = null;
  
  private defaultOptions: StyleOptions = {
    theme: 'dark',
    accentColor: '#676FFF',
    fontFamily: 'system-ui, sans-serif'
  }

  private constructor() {}

  public static getInstance(): StyleService {
    if (!StyleService.instance) {
      StyleService.instance = new StyleService();
    }
    return StyleService.instance;
  }

  public generateStyle(options: StyleOptions = {}): CSSProperties {
    const mergedOptions = { ...this.defaultOptions, ...options }

    return {
      backgroundColor: mergedOptions.theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: mergedOptions.theme === 'dark' ? '#ffffff' : '#000000',
      accentColor: mergedOptions.accentColor,
      fontFamily: mergedOptions.fontFamily,
      '--app-error-color': '#ef4444',
      '--app-success-color': '#22c55e',
      '--app-warning-color': '#f59e0b',
    } as CSSProperties
  }
}

// Create a singleton instance
const styleServiceInstance = StyleService.getInstance();

// Export the singleton instance
export const getStyleService = () => styleServiceInstance; 