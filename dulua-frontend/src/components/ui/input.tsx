"use client"

import * as React from "react"
import { cn } from "@lib/utils"
import { Label } from "@radix-ui/react-label"
import { Eye, EyeOff } from "lucide-react" // or use your preferred icon set
import Link from "next/link"

interface InputProps extends React.ComponentProps<"input"> {
    label?: string
    forgotPassword?: boolean
}

function Input({
    className,
    label,
    forgotPassword,
    type = "text",
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"

    return (
        <div className="grid w-full gap-[4px]">
            <div className="cont flex justify-between items-center">
                {label && (
                    <Label
                        htmlFor={props.id}
                        className="text-[var(--input-text)]"
                    >
                        {label}
                    </Label>
                )}
                {forgotPassword && (
                    <Link href="/auth/forgotPassword">
                        <Label className="text-foreground text-sm cursor-pointer">
                            Forgot Password?
                        </Label>
                    </Link>
                )}
            </div>
            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    className={cn(
                        "file:text-foreground placeholder:text-gray-300 selection:bg-primary selection:text-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-[8px] border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff color="#1877F2" size={18} />
                        ) : (
                            <Eye color="#1877F2" size={18} />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export { Input }
