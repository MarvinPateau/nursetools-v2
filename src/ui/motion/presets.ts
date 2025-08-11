import type { Variants } from 'framer-motion'
import { transition } from './transition'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition },
  exit: { opacity: 0, y: -12, transition },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  enter: { opacity: 1, scale: 1, transition },
  exit: { opacity: 0, scale: 0.98, transition },
}

export const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition },
  exit: { opacity: 0, y: -8, transition },
}
