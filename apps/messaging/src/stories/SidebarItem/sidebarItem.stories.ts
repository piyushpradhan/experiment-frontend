import { StoryObj } from '@storybook/react'
import { SidebarItem } from '.'

const meta = {
  title: 'Sidebar/SidebarItem',
  component: SidebarItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    label: 'Primary item',
  },
}
