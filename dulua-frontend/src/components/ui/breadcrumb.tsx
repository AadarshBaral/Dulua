"use client"

import { ChevronRight } from "lucide-react"
import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { capitalizeWords, cn } from "@lib/utils"

const Breadcrumb = () => {
    const pathname = usePathname() // e.g., "/help-center/feedback"
    const pathSegments = pathname?.split("/").filter(Boolean) // ['help-center', 'feedback']

    const buildHref = (index: number) => {
        const path = "/" + pathSegments?.slice(0, index + 1).join("/")
        return path
    }

    return (
        <nav>
            <ul className="flex items-center gap-1 text-gray-400 text-md">
                {pathSegments?.map((segment, index) => {
                    const href = buildHref(index)
                    const isLast = index === pathSegments.length - 1

                    return (
                        <li key={index} className="flex items-center gap-1">
                            <Link
                                href={href}
                                className={cn(isLast && " text-gray-400")}
                            >
                                {capitalizeWords(
                                    // /product%20FAQ -> product FAQ
                                    decodeURIComponent(
                                        segment.replace(/-/g, " ")
                                    )
                                )}
                            </Link>
                            {!isLast && (
                                <ChevronRight className="mt-0.5" size={14} />
                            )}
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default Breadcrumb
