'use client'

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from "@livekit/components-react";
import { PlaygroundConnect } from "../app/components/PlaygroundConnect";
import { useConfig } from "../hooks/useConfig";
import { ConnectionMode, useConnection } from "../hooks/useConnection";
import { AppConfig } from "../app/types/AppConfig";

const themeColors = [
  "cyan",
  "green",
  "amber",
  "blue",
  "violet",
  "rose",
  "pink",
  "teal",
];

export default function HomeInner() {
  const { shouldConnect, wsUrl, token, mode, connect, disconnect } = useConnection();
  const { config } = useConfig();
  const [configState, setConfigState] = useState<AppConfig | null>(null);

  useEffect(() => {
    if (config?.settings?.theme_color !== configState?.settings?.theme_color) {
      setConfigState(config);
    }
  }, [config?.settings?.theme_color]);

  const handleConnect = useCallback(
    async (c: boolean, mode: ConnectionMode) => {
      c ? connect(mode) : disconnect();
    },
    [connect, disconnect]
  );

  const showPG = useMemo(() => {
    if (process.env.NEXT_PUBLIC_LIVEKIT_URL) {
      return true;
    }
    if(wsUrl) {
      return true;
    }
    return false;
  }, [wsUrl])

  return (
    <main className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black repeating-square-background">
      {showPG ? (
        <LiveKitRoom
          className="flex flex-col h-full w-full"
          serverUrl={wsUrl}
          token={token}
          connect={shouldConnect}
          onError={(e) => {
            console.error(e);
          }}
        >
          <RoomAudioRenderer />
          <StartAudio label="Click to enable audio playback" />
        </LiveKitRoom>
      ) : (
        <PlaygroundConnect
          accentColor={themeColors[0]}
          onConnectClicked={(mode) => {
            handleConnect(true, mode);
          }}
        />
      )}
    </main>
  );
}
