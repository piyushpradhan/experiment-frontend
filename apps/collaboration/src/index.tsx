import { Box, Button, Modal, Input } from 'design-system'
import Cursors from './components/Cursors'
import { ChangeEvent, useEffect, useState } from 'react'
import { CursorMap } from './types'
import './index.scss'

const Collaboration = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [cursors, setCursors] = useState<CursorMap>({})
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
        <Cursors
          name={parsedUser.name}
          cursors={cursors}
          setCursors={setCursors}
        />
      </Box>
    )
  }

  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
    if (cursors[e.target.value]) {
      setIsInvalid(true)
    }
    setIsInvalid(false)
  }

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
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
      >
        <div className="join-form-container">
          <Input
            type="text"
            value={id}
            onChange={handleUserIdChange}
            placeholder="Enter ID..."
            isInvalid={isInvalid}
          />
          <Input
            type="text"
            value={name}
            onChange={handleUserNameChange}
            placeholder="Enter name..."
          />
        </div>
      </Modal>
    </Box>
  )
}

export default Collaboration
