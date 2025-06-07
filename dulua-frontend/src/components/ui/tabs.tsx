"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export type TabProps<T> = {
    name: T
    href: string
    label: React.ReactNode
    icon?: React.ReactNode
}

export function Tab<T extends string>({
    name,
    label,
    href,
    icon,
}: TabProps<T>) {
    const pathname = usePathname()
    const isActive = pathname?.includes(name) // or strict comparison depending on structure

    return (
        <li className="inline-block select-none text-base relative group">
            <Link href={href}>
                <div
                    className={clsx(
                        "flex flex-col items-center justify-center px-4 py-2 text-base transition",
                        isActive
                            ? "text-blue-500"
                            : "text-gray-500 hover:text-blue-400"
                    )}
                >
                    {icon && <span>{icon}</span>}
                    <span className="text-center w-full">
                        {typeof label === "string"
                            ? label
                            : React.cloneElement(label as React.ReactElement)}
                    </span>
                </div>
            </Link>

            {/* Underline effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px">
                <div
                    className={clsx(
                        "absolute inset-0  transition-opacity",
                        isActive ? "opacity-0" : "group-hover:opacity-100"
                    )}
                />
                <div
                    className={clsx(
                        "absolute inset-0 bg-blue-400 transition-opacity",
                        isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                    )}
                />
            </div>
        </li>
    )
}
