// 6NGen — Yeniden kullanılabilir buton bileşeni
// RTL uyumlu, strict TypeScript, global standartlara uygun

import { ReactNode } from 'react'

// Buton varyantlarının renk tanımları
const VARIANT_STYLES: Record<string, { background: string; color: string }> = {
  primary: { background: '#E8960A', color: '#000' },
  danger:  { background: '#e74c3c', color: '#fff' },
  ghost:   { background: '#333',    color: '#fff' },
}

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'danger' | 'ghost'
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type = 'button',
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyle,
        border: 'none',
        borderRadius: '8px',
        paddingBlock: '0.6rem',
        paddingInline: '1.25rem',
        cursor: disabled ? 'default' : 'pointer',
        fontWeight: 'bold',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        textAlign: 'center',
      }}
    >
      {children}
    </button>
  )
}
