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
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subTitle,
  actions,
  children,
}) => {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          {subTitle && <h3 className="dialog-subtitle">{subTitle}</h3>}
        </div>
        <div className="dialog-body">{children}</div>
        <div className="dialog-footer">
          {actions && <div className="dialog-actions">{actions}</div>}
          <Button onClick={onClose} label="Close" />
        </div>
      </div>
    </div>
  )
}

export default Modal
