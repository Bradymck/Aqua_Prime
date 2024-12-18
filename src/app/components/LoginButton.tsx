'use client';

import { usePrivy } from '@privy-io/react-auth';
import React from 'react';

export function LoginButton() {
    const { login, authenticated, user } = usePrivy();

    if (authenticated) {
        return <div>Welcome, {user?.email || user?.wallet?.address}</div>;
    }

    return (
        <button onClick={login}>
            Login
        </button>
    );
} 