import React, { ChangeEvent } from 'react'
import './style.scss'

export type InputProps = {
  type?: 'email' | 'text' | 'password'
  placeholder?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  isInvalid?: boolean
} & React.HTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      isInvalid = false,
      ...props
    },
    ref
  ) => (
    <>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        className="input"
        placeholder={placeholder}
        {...props}
      />
      {isInvalid && <p className="input-error">Error state</p>}
    </>
  )
)

export default Input
