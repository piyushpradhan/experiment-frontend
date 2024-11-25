import React, { ChangeEvent } from 'react'
import './style.scss'

export type InputProps = {
  type?: 'email' | 'text' | 'password'
  placeholder?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  isInvalid?: boolean
  label?: string
  errorMsg?: string
} & React.HTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      isInvalid = false,
      label,
      errorMsg = 'Please enter a valid value',
      ...props
    },
    ref
  ) => {
    return (
      <div className="input__container">
        {label && (
          <label htmlFor="ds_input" className="input__label">
            {label}
          </label>
        )}
        <input
          id="ds_input"
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          className="input"
          placeholder={placeholder}
          {...props}
        />
        {isInvalid && <p className="input-error">{errorMsg}</p>}
      </div>
    )
  }
)
export default Input
