import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'

type FeatureCardProps = {
    title: string
    description: string
    icon: ReactNode
    index?: number
}

export function FeatureCard({ title, description, icon, index = 0 }: FeatureCardProps) {
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            custom={index}
            className="h-full"
        >
            <motion.div
                className="group h-full bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl border border-border/60 hover:border-primary/60 p-6 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.03]"
                whileHover={shouldReduceMotion ? { scale: 1.02 } : { scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
            >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    {icon}
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>
        </motion.div>
    )
}

