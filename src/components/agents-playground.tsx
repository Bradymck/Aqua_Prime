import React from "react";

interface AgentsPlaygroundProps {
  token: string;
  serverUrl: string;
}

export default function AgentsPlayground({ token, serverUrl }: AgentsPlaygroundProps) {
  return (
    <div>
      <h1>Agents Playground</h1>
      {/* Add your playground content here */}
    </div>
  );
} 