// 6NGen — Yeniden kullanılabilir input bileşeni
// RTL uyumlu, strict TypeScript, global standartlara uygun

interface InputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'date'
  disabled?: boolean
  fullWidth?: boolean
}

export default function Input({
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  fullWidth = true,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      style={{
        display: 'block',
        width: fullWidth ? '100%' : 'auto',
        paddingBlock: '0.75rem',
        paddingInline: '1rem',
        marginBlockEnd: '1rem',
        background: '#0a0a0a',
        border: '1px solid #333',
        color: 'white',
        borderRadius: '8px',
        fontSize: '1rem',
        opacity: disabled ? 0.6 : 1,
      }}
    />
  )
}
