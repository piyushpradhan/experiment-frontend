import type { Meta, StoryObj } from '@storybook/react'
import Modal, { ModalProps } from './Modal'
import Button from '../Button/Button'
import { useState } from 'react'

const meta = {
  title: 'Component/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    isOpen: false,
    title: 'Modal Title',
    subTitle: 'This is a subtitle',
    actions: null,
    children: 'Modal content goes here.',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const Template = (args: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <div>
      <Button onClick={handleOpen} label="Open Modal" />
      <Modal {...args} isOpen={isOpen} onClose={handleClose} />
    </div>
  )
}

export const Primary: Story = {
  render: Template,
  args: {
    isOpen: false,
    title: 'Modal Title',
    subTitle: 'This is a subtitle',
    actions: <Button onClick={() => alert('Action clicked!')} label="Action" />,
    children: 'Modal content goes here.',
    onClose: () => {},
  },
}
