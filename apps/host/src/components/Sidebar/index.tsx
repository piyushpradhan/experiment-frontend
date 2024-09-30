import { NavLink } from 'react-router-dom'
import { Bell, MessagesSquare, Package2, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Sidebar = () => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">Acme Inc</span>
        </a>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavLink
            to="/messaging"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary ${
                isActive ? 'bg-muted' : ''
              }`
            }
          >
            <MessagesSquare className="h-4 w-4" />
            Messages
          </NavLink>
        </nav>
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary ${
                isActive ? 'bg-muted' : ''
              }`
            }
          >
            <Users className="h-4 w-4" />
            Customers
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
