import './style.scss'

type Props = {
  messageBody: {
    x: number
    y: number
    color: string
    sender: string
    name: string
  }
}

const Cursor = ({ messageBody }: Props) => {
  const cursorStyle = {
    position: 'absolute' as React.CSSProperties['position'],
    left: `${messageBody.x}%`,
    top: `${messageBody.y}%`,
    fill: `hsl(${messageBody.color}, 50%, 50%)`,
    stroke: 'black',
    pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    transition: 'all 0.1s',
  }

  return (
    <div style={cursorStyle}>
      <svg className="cursor" width="20" height="20">
        <path d="M10 0 L20 20 H0 Z" />
      </svg>
      <div
        className="cursor-label"
        style={{ backgroundColor: `hsl(${messageBody.color}, 50%, 50%)` }}
      >
        {messageBody.name}
      </div>
    </div>
  )
}

export default Cursor
