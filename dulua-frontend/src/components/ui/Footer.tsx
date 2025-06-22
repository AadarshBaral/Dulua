import React from "react"

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-emerald-800 to-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center">
                    <h2 className="text-5xl font-light mb-12 tracking-wide">
                        DULUA
                    </h2>

                    <div className="mb-8">
                        <p className="text-sm text-white/80 mb-6">
                            Social Links
                        </p>
                        <div className="flex justify-center gap-4">
                            {[
                                "TikTok",
                                "Instagram",
                                "Facebook",
                                "LinkedIn",
                                "Twitter",
                            ].map((social) => (
                                <button
                                    key={social}
                                    className="w-12 h-12 bg-white/20 rounded-full hover:bg-white/30 transition-colors flex items-center justify-center"
                                >
                                    <span className="text-xs">
                                        {social.charAt(0)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm text-white/60">
                        © 2025 Dulua. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
