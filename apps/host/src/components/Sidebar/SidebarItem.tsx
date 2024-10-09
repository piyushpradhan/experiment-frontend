import { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
}

const SidebarItem = ({ icon, label }: Props) => {
  const notSelectedStyles = 'text-muted-foreground'
  //const selectedStyles = "bg-muted text-primary";
  return (
    <a
      href="#"
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${notSelectedStyles}`}
    >
      {icon}
      {label}
    </a>
  )
}

export default SidebarItem
