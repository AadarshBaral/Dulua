"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ReactElement, useEffect, useRef, useState } from "react"
import type { TabProps } from "./Tab"
import { Button } from "./button"
import { IconShare, IconLink } from "@tabler/icons-react"
import BookmarkButton from "./BookmarkButton"
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from "next-share"

interface TabsProps {
    place_id: string
    children: ReactElement<TabProps>[]
}

const Tabs = ({ children, place_id }: TabsProps) => {
    const [active, setActive] = useState(0)
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const shareRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentUrl =
        typeof window !== "undefined"
            ? window.location.href
            : "https://explorepokhara.com"

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

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(event.target as Node)
            ) {
                setIsShareOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // ✅ Copy Link handler
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <div className="w-full relative">
            <div className="options flex items-center justify-between mb-4">
                {/* Tab navigation */}
                <div className="flex items-center flex-wrap gap-12 border-b border-gray-300">
                    {children.map((child, index) => {
                        const isActive = index === active
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
                                    child.key[0].toUpperCase() +
                                        child.key.slice(1)}
                            </a>
                        )
                    })}
                </div>

                {/* Buttons */}
                <div className="option-button flex gap-4 items-center relative">
                    <div className="relative" ref={shareRef}>
                        <Button
                            className="border-0 hover:bg-transparent rounded-none cursor-pointer group"
                            variant="outline"
                            onClick={() => setIsShareOpen((prev) => !prev)}
                        >
                            <IconShare />
                            <span className="border-b-2 border-foreground group-hover:border-accent">
                                Share
                            </span>
                        </Button>

                        {isShareOpen && (
                            <div className="absolute right-0 top-12 z-50 bg-white border rounded-xl shadow-lg p-4 flex flex-col gap-3 w-56">
                                <FacebookShareButton url={currentUrl}>
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                        <FacebookIcon size={32} round />
                                        <span>Facebook</span>
                                    </div>
                                </FacebookShareButton>

                                <TwitterShareButton
                                    url={currentUrl}
                                    title="Explore Pokhara"
                                >
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                        <TwitterIcon size={32} round />
                                        <span>Twitter / X</span>
                                    </div>
                                </TwitterShareButton>

                                <WhatsappShareButton
                                    url={currentUrl}
                                    title="Explore Pokhara"
                                >
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                        <WhatsappIcon size={32} round />
                                        <span>WhatsApp</span>
                                    </div>
                                </WhatsappShareButton>

                                <LinkedinShareButton url={currentUrl}>
                                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                        <LinkedinIcon size={32} round />
                                        <span>LinkedIn</span>
                                    </div>
                                </LinkedinShareButton>

                                {/* ✅ Copy Link button */}
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md text-left text-sm"
                                >
                                    <IconLink size={28} />
                                    {copied ? (
                                        <span className="text-green-600 font-semibold">
                                            Copied!
                                        </span>
                                    ) : (
                                        <span>Copy Link</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="cont border-2 border-gray-300 rounded-full ">
                        <BookmarkButton place_id={place_id} />
                    </div>
                </div>
            </div>

            <div>{children[active]}</div>
        </div>
    )
}

export default Tabs
