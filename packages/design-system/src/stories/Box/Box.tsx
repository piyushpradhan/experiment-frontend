import React from 'react'
import './style.scss'

export interface BoxProps {
  direction?: 'column' | 'row'
  width?: string
  height?: string
  border?: string
  children: React.ReactNode
}

const Box = ({
  direction = 'column',
  width = '100%',
  height = '100%',
  border = 'none',
  children,
  ...props
}: BoxProps) => {
  return (
    <div
      className={`box box--${direction}`}
      style={{ width, height, border }}
      {...props}
    >
      {children}
    </div>
  )
}

export default Box
