import React from 'react'

const Test: React.FC = () => {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

export default Test
