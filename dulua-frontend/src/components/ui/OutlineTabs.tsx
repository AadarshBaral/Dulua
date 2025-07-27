"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ReactElement, useEffect, useRef, useState } from "react"
import type { TabProps } from "./Tab"

interface TabsProps {
    children: ReactElement<TabProps>[]
}

const Tabs = ({ children }: TabsProps) => {
    const [active, setActive] = useState(0)
    const router = useRouter()
    const ref = useRef<any>(null)
    const searchParams = useSearchParams()
    console.log("tab is being rendererd", children)
    useEffect(() => {
        const tabKey = searchParams?.get("tab")
        if (!tabKey) return
        const index = children.findIndex((child) => child.key === tabKey)
        if (index >= 0) setActive(index)
    }, [searchParams, children])
    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        index: number,
        tabKey: string,
        cb?: () => void
    ) => {
        e.preventDefault()
        const url = new URL(window.location.href)
        url.searchParams.set("tab", tabKey)
        router.push(url.toString(), { scroll: false })

        setActive(index)
        cb?.()
    }

    return (
        <div className="w-full">
            <div
                ref={ref}
                className="flex flex-wrap gap-12 border-b border-gray-300 mb-4"
            >
                {children.map((child, index) => {
                    const isActive = index === active
                    console.log("hellochild", child)
                    return (
                        <a
                            href="#"
                            key={String(child.key)}
                            onClick={(e) =>
                                handleClick(
                                    e,
                                    index,
                                    String(child.key),
                                    child.props.onClick
                                )
                            }
                            className={`text-base pb-2 ${
                                isActive
                                    ? "text-green-900 border-b-2 border-green-900 font-semibold"
                                    : "text-gray-500"
                            } hover:text-green-800 transition`}
                        >
                            {child.key &&
                                child.key[0].toUpperCase() + child.key.slice(1)}
                        </a>
                    )
                })}
            </div>
            <div>{children[active]}</div>
        </div>
    )
}

export default Tabs
