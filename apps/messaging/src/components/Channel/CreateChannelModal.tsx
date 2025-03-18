import { SquarePen } from 'lucide-react'

import { ChangeEvent, useState } from 'react'
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
import { useSocket } from '@messaging/lib/hooks/sources'

const CreateChannelModal = () => {
  const [channelName, setChannelName] = useState<string>('')
  const { createChannel } = useSocket()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.currentTarget.value)
  }

  const handleCreateChannel = () => {
    if (channelName.trim().length > 0) {
      createChannel(channelName)
      setChannelName('')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
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
              variant="default"
              onClick={handleCreateChannel}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
