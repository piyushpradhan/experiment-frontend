import type { Meta, StoryObj } from '@storybook/react'
import Input from './Input'
import { fn } from '@storybook/test'
const meta = {
  title: 'Component/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    isInvalid: { control: 'boolean' },
    errorMsg: { control: 'text' },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>
export default meta
type Story = StoryObj<typeof meta>
export const TextInput: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text here',
    value: '',
    onChange: fn(),
    label: '',
    isInvalid: false,
    errorMsg: 'Please enter a valid value',
  },
}
