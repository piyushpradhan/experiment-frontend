import { useCallback, useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Input } from '@messaging/components/ui/input'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@messaging/components/ui/form'

import { VenetianMask } from 'lucide-react'
import { createUser } from '@messaging/api/user'
import { useDispatch } from 'react-redux'
import {
  createUserOptimistic,
  storeCreatedUser,
} from '@messaging/store/actions/user'
import { User } from '@messaging/types'

const userCreationForm = z.object({
  name: z.string().min(3, {
    message: 'Name be at least 3 characters',
  }),
  email: z.string().email({
    message: 'Please enter a valid email',
  }),
})

const JoinModal = () => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<z.infer<typeof userCreationForm>>({
    resolver: zodResolver(userCreationForm),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const handleSubmit = useCallback(
    async (values: z.infer<typeof userCreationForm>) => {
      dispatch(createUserOptimistic({ name: values.name, email: values.email }))
      const createdUser: User = await createUser(values.name, values.email)
      // Update the `active` user
      dispatch(storeCreatedUser(createdUser))
      // Update the local storage
      localStorage.setItem('user', createdUser.uid)
      setIsModalOpen(false)
    },
    []
  )

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="flex flex-row items-center justify-center gap-2"
          onClick={handleOpenModal}
        >
          Join anonymously <VenetianMask />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col space-y-2 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={() => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="overflow-hidden"
                      placeholder="Anonymous"
                      {...form.register('name')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={() => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="overflow-hidden"
                      placeholder="email@email.com"
                      {...form.register('email')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                className="overflow-hidden p-2"
                onClick={form.handleSubmit(handleSubmit)}
              >
                <p className="overflow-hidden text-ellipsis">
                  Join anonymously
                </p>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default JoinModal
