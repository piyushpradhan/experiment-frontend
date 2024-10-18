import { Box, Button, Modal } from 'design-system'
import Cursors from './components/Cursors'
import { useEffect, useState } from 'react'

function Collaboration() {
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const storedUser: string = localStorage.getItem('collaborative-user') || '{}'
  const parsedUser = JSON.parse(storedUser)

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    setName(parsedUser.name)
  }, [storedUser])

  if (Object.keys(parsedUser).length > 0) {
    return (
      <Box direction="column" border="none">
        <Cursors name={parsedUser.name} />
      </Box>
    )
  }

  return (
    <Box direction="column" border="none">
      <Button
        label="Join this collaborative document"
        primary
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Join collaborative session"
        actions={
          <Button
            onClick={() => {
              setIsOpen(false)
              localStorage.setItem(
                'collaborative-user',
                JSON.stringify({ id, name })
              )
            }}
            label="Join"
          />
        }
        children={
          <>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter ID..."
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
            />
          </>
        }
      />
    </Box>
  )
}

export default Collaboration
