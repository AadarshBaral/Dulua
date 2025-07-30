import {
    IconBrandGithub,
    IconBrandGravatar,
    IconBrandX,
    IconExchange,
    IconHome,
    IconLeaf2,
    IconMap,
    IconNewSection,
    IconTerminal2,
    IconUserCircle,
} from "@tabler/icons-react"

export const links = [
    {
        title: "Home",
        icon: (
            <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/",
    },

    {
        title: "City Map",
        icon: (
            <IconMap className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "/city-map",
    },

    // {
    //     title: "Hiking",
    //     icon: (
    //         <IconLeaf2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //     ),
    //     href: "#",
    // },
    {
        title: "Profile",
        icon: (
            <IconUserCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
        ),
        href: "#",
    },
]
