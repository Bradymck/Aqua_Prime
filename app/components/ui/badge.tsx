import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: 'outline' | 'filled'
}

export function Badge({ children, className = '', variant = 'filled' }: BadgeProps) {
  const baseStyle = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
  const variantStyle = variant === 'outline' ? 'border' : 'bg-pink-100 text-pink-800'

  return <span className={`${baseStyle} ${variantStyle} ${className}`}>{children}</span>
}