import type { Variants } from 'framer-motion'

export const createStaggerContainer = (stagger: number = 0.1, delayChildren: number = 0): Variants => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: stagger,
            delayChildren,
        },
    },
})

