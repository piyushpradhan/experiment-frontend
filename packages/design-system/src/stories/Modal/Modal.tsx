import React from 'react'
import './style.scss'

import Button from '../Button/Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subTitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  hideClose?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subTitle,
  actions,
  hideClose = false,
  children,
}) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close-icon--container">
          <span className="modal-close-icon">&#10005;</span>
        </div>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {subTitle && <h3 className="modal-subtitle">{subTitle}</h3>}
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          {actions && <div className="modal-actions">{actions}</div>}
          {!hideClose && <Button onClick={onClose} label="Close" />}
        </div>
      </div>
    </div>
  )
}

export default Modal
