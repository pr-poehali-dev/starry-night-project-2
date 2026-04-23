import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import type { SectionProps } from "@/types"

export default function Section({ id, title, subtitle, content, isActive, showButton, buttonText, showSecondButton, secondButtonText, showThirdButton, thirdButtonText }: SectionProps) {
  const navigate = useNavigate()
  return (
    <section id={id} className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      {subtitle && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.div>
      )}
      <motion.h2
        className="text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-bold leading-[1.1] tracking-tight max-w-4xl text-white whitespace-pre-line"
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {content && (
        <motion.p
          className="text-lg md:text-xl lg:text-2xl max-w-2xl mt-6 text-neutral-400"
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {content}
        </motion.p>
      )}
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-16 flex flex-wrap gap-4"
        >
          <Button
            variant="outline"
            size="lg"
            className="text-cyan-400 bg-transparent border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
            onClick={() => id === 'hero' ? navigate('/calculator') : undefined}
          >
            {buttonText}
          </Button>
          {showSecondButton && (
            <Button
              variant="outline"
              size="lg"
              className="text-violet-400 bg-transparent border-violet-400 hover:bg-violet-400 hover:text-black transition-colors"
              onClick={() => navigate('/graph')}
            >
              {secondButtonText}
            </Button>
          )}
        </motion.div>
      )}
    </section>
  )
}