import { Box, Button, Input, Modal } from 'design-system'
import Cursors from './components/Cursors'
import { ChangeEvent, useEffect, useState } from 'react'
import './index.scss'

function Collaboration() {
  const [isOpen, setIsOpen] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [nameTouched, setNameTouched] = useState(false)
  const [idTouched, setIdTouched] = useState(false)
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
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Join collaborative session"
        actions={
          <Button
            onClick={() => {
              if (id.length >= 6 && name.length >= 3) {
                setIsOpen(false)
                localStorage.setItem(
                  'collaborative-user',
                  JSON.stringify({ id, name })
                )
              }
            }}
            label="Join"
          />
        }
      >
        <div className="modal-content">
          <Input
            type="text"
            value={id}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setId(e.target.value)
            }}
            onBlur={() => setIdTouched(true)}
            label="ID"
            placeholder="Enter ID..."
            isInvalid={idTouched && id.length < 6}
            errorMsg="ID must have at least 6 characters"
          />
          <Input
            type="text"
            value={name}
            label="Name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
            }}
            onBlur={() => setNameTouched(true)}
            placeholder="Enter name..."
            isInvalid={nameTouched && name?.length < 3}
            errorMsg="Name must have at least 3 characters"
          />
        </div>
      </Modal>
    </Box>
  )
}

export default Collaboration
