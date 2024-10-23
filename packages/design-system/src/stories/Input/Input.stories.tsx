import type { Meta, StoryObj } from '@storybook/react'
import Input, { InputProps } from './Input'

const meta = {
  title: 'Component/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    type: 'text',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const StandardTemplate = ({ type, placeholder }: InputProps) => {
  return <Input type={type} placeholder={placeholder} />
}

const TrailingIconTemplate = ({
  type,
  placeholder,
  trailingIcon,
}: InputProps) => {
  return (
    <Input type={type} placeholder={placeholder} trailingIcon={trailingIcon} />
  )
}

export const Standard: Story = {
  render: StandardTemplate,
  args: {
    type: 'text',
    placeholder: 'Type here...',
  },
}

export const WithTrailingIcon: Story = {
  render: TrailingIconTemplate,
  args: {
    type: 'text',
    placeholder: 'Type here',
    trailingIcon: <div>&#9998;</div>,
  },
}
