/**
 * @file MoonstoneBalance.tsx
 * Reusable component for displaying Moonstone balance.
 */

import { useBalances } from '@/private/hooks/useBalances'

interface MoonstoneBalanceProps {
  className?: string
  showIcon?: boolean
}

export function MoonstoneBalance({ className = '', showIcon = true }: MoonstoneBalanceProps) {
  const { moonstone } = useBalances()

  console.log('MoonstoneBalance rendering with value:', moonstone)

  return (
    <span className={className}>
      {moonstone.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      {showIcon ? ' 💎' : ''}
    </span>
  )
}