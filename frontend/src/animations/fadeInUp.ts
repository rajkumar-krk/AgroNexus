import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: custom * 0.1,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
}

