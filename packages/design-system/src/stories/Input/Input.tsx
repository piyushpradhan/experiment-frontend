import React from 'react'
import './style.scss'

export interface InputProps {
  type?: string
  placeholder?: string
  trailingIcon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder = 'Type here...',
  trailingIcon,
  ...props
}: InputProps & React.HTMLAttributes<HTMLInputElement>) => {
  if (trailingIcon) {
    return (
      <div className="input-container">
        <input
          type={type}
          placeholder={placeholder}
          className="input"
          {...props}
        />
        <div className="input--trailing-icon">{trailingIcon}</div>
      </div>
    )
  }

  return (
    <input type={type} placeholder={placeholder} className="input" {...props} />
  )
}

export default Input
