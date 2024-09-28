import { SquarePen } from 'lucide-react'

import { ChangeEvent, useState, useCallback } from 'react'
import { Button } from '@messaging/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@messaging/components/ui/dialog'
import { Input } from '@messaging/components/ui/input'
import { Label } from '@messaging/components/ui/label'
import { useSocket } from '@messaging/store/hooks'

const CreateChannelModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [channelName, setChannelName] = useState<string>('')
  const { createChannel } = useSocket()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.currentTarget.value)
  }

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleCreateChannel = (e: unknown) => {
    // @ts-expect-error - e represents both onSubmit and onClick
    e.preventDefault()
    createChannel(channelName)
    setIsModalOpen(false)
    setChannelName('')
  }

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={handleOpenModal}
        >
          <SquarePen size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create channel</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              type="text"
              id="link"
              value={channelName}
              onChange={handleChange}
              onSubmit={handleCreateChannel}
              placeholder="Enter the channel name..."
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="default" onClick={handleCreateChannel}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
