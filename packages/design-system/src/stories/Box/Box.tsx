import React from 'react'
import './style.scss'

export interface BoxProps {
  direction?: 'column' | 'row'
  width?: string
  height?: string
  border?: string
  children: React.ReactNode
}
const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <div
    ref={ref}
    className={`box box--${props.direction}`}
    style={{
      width: props.width,
      height: props.height,
      border: props.border,
      position: 'relative',
    }}
    {...props}
  >
    {props.children}
  </div>
))

export default Box
