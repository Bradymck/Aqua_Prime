'use client'

import Playground, { PlaygroundProps } from './Playground'

export default function PlaygroundWrapper({ 
  logo, 
  themeColors 
}: Omit<PlaygroundProps, 'onConnect'>) {
  const handleConnect = (connect: boolean, opts?: { token: string; url: string }) => {
    // Your connection logic here
  }

  return (
    <Playground
      logo={logo}
      themeColors={themeColors}
      onConnect={handleConnect}
    />
  )
} 