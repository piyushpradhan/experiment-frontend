import './style.scss'

export interface ButtonProps {
  primary?: boolean
  backgroundColor?: string
  size?: 'small' | 'medium' | 'large'
  label: string
  onClick?: () => void
}

const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps & React.HTMLAttributes<HTMLButtonElement>) => {
  const mode = primary ? 'button--primary' : 'button--secondary'
  return (
    <button
      type="button"
      className={`button button--${size} ${mode}`}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  )
}

export default Button
