import { Meta, StoryObj } from '@storybook/react'

import Box from './Box'

const meta = {
  title: 'Component/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    border: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Box>

export default meta
type Story = StoryObj<typeof meta>

export const Column: Story = {
  args: {
    direction: 'column',
    children: 'Flex column container',
  },
}

export const Row: Story = {
  args: {
    direction: 'row',
    children: 'Flex row container',
  },
}
