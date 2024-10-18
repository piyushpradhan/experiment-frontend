import React from 'react'
import './style.scss'

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
          <button className="dialog-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="dialog-body">{children}</div>
        {actions && <div className="dialog-actions">{actions}</div>}
        <div className="dialog-footer">
          <button className="dialog-footer-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
