import { useState } from 'react'
import { Button, Modal } from 'design-system'
import Footer from './Footer'

import './style.scss'

const JoinModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const handleOpen = () => {
    setIsModalOpen(true)
  }

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Join collaborative session"
        actions={<Footer />}
        hideClose
      >
        <div className="join-input-container">
          <div className="field-container">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name here..."
              className="input"
            />
          </div>
          <div className="field-container">
            <label htmlFor="email" className="label">
              Email ID
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email address..."
              className="input"
            />
          </div>
        </div>
      </Modal>
      <Button label="Join session" onClick={handleOpen} />
    </div>
  )
}

export default JoinModal
