import { ReactNode } from "react";

interface SidebarItemProps {
  icon?: ReactNode;
  label: string;
}

export const SidebarItem = ({ icon, label }: SidebarItemProps) => {
  const notSelectedStyles = "text-muted-foreground";
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
