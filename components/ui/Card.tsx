// 6NGen — Yeniden kullanılabilir kart bileşeni
// RTL uyumlu, strict TypeScript, global standartlara uygun

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'warning' | 'success'
  onClick?: () => void
}

const VARIANT_STYLES: Record<string, { background: string; border: string }> = {
  default: { background: '#1a1a1a', border: '1px solid #333' },
  warning: { background: '#2a1500', border: '1px solid #E8960A' },
  success: { background: '#0a1f0a', border: '1px solid #4CAF50' },
}

export default function Card({
  children,
  variant = 'default',
  onClick,
}: CardProps) {
  const variantStyle = VARIANT_STYLES[variant]

  return (
    <div
      onClick={onClick}
      style={{
        ...variantStyle,
        borderRadius: '12px',
        paddingBlock: '1.25rem',
        paddingInline: '1.5rem',
        marginBlockEnd: '1rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  )
}
