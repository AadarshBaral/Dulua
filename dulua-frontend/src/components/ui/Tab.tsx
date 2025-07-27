import { ReactNode } from "react"

export interface TabProps {
    title: string
    children: ReactNode
    onClick?: () => void
}

export default function Tab({ children }: TabProps) {
    return <>{children}</>
}
