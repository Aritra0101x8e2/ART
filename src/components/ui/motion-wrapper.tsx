import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface MotionWrapperProps extends Omit<MotionProps, 'animate'> {
  children: React.ReactNode;
  className?: string;
  animate?: any;
}

export const MotionDiv: React.FC<MotionWrapperProps> = ({ children, className, ...props }) => (
  <motion.div className={className} {...props}>
    {children}
  </motion.div>
);

export const MotionSection: React.FC<MotionWrapperProps> = ({ children, className, ...props }) => (
  <motion.section className={className} {...props}>
    {children}
  </motion.section>
);

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};