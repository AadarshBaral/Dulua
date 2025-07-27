/** @type {import('next').NextConfig} */

const apiUrl = new URL(process.env.API_URL || "http://localhost:8000")

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: apiUrl.protocol.replace(":", ""),
                hostname: apiUrl.hostname,
                port: apiUrl.port || "", // optional
                pathname: "/**",
            },
        ],
    },
    eslint: {
        dirs: ["pages", "utils"],
    },
}
