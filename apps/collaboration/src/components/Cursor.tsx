type Props = {
  messageBody: {
    x: number
    y: number
    color: string
  }
}

const Cursor = ({ messageBody }: Props) => {
  const cursorStyle = {
    position: 'absolute' as React.CSSProperties['position'],
    left: `${messageBody.x}%`,
    top: `${messageBody.y}%`,
    fill: `hsl(${messageBody.color}, 50%, 50%)`,
    pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    transition: 'all 0.1s',
  }

  return (
    <svg style={cursorStyle} width="20" height="20">
      <path d="M10 0 L20 20 H0 Z" />
    </svg>
  )
}

export default Cursor
