import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Button from './Button'

const meta = {
  title: 'Component/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Button',
  },
}

export const Error: Story = {
  args: {
    variant: 'danger',
    label: 'Cancel',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
}
