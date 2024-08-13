import { createContext, ReactNode, useState } from 'react'

interface SidebarContextProps {
    isOpen: boolean;
    setIsClose: (isOpen: boolean) => void;
}

const defaultValue: SidebarContextProps = {
    isOpen: false,
    setIsClose: () => {},
};


export const SidebarContext = createContext<SidebarContextProps>(defaultValue)

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsClose] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsClose }}>
      { children }
    </SidebarContext.Provider>
  )
}
