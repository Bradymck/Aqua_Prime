'use client'

import React, { createContext, useContext, useState } from 'react'

type ConfigContextType = {
  theme: string
  setTheme: (theme: string) => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark')

  return (
    <ConfigContext.Provider value={{ theme, setTheme }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
