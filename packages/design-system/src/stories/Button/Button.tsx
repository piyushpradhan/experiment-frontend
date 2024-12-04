import './style.scss'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label?: string
  children?: React.ReactNode
  onClick?: () => void
}

const Button = ({
  variant = 'primary',
  size = 'medium',
  backgroundColor,
  label,
  children = null,
  ...props
}: ButtonProps & React.HTMLAttributes<HTMLButtonElement>) => {
  const mode = `button--${variant}`
  return (
    <button
      type="button"
      className={`button button--${size} ${mode}`}
      style={{ backgroundColor }}
      {...props}
    >
      {children ?? label}
    </button>
  )
}

export default Button
