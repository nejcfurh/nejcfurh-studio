import { TECH_STACK_DATA } from '@/features/tilt-card/constants';
import { motion, Variants } from 'motion/react';

const fadeInAnimationVariants = {
  initial: { opacity: 0, y: 100 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05 },
  }),
};

interface ItemsListProps {
  classNameItems?: string;
  className?: string;
  variants?: Variants;
}

const ItemsList = ({ classNameItems, className, variants }: ItemsListProps) => {
  return (
    <ul className={className}>
      {TECH_STACK_DATA.map((tech, index) => (
        <motion.li
          className={classNameItems}
          key={tech.name}
          variants={variants ?? fadeInAnimationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          custom={index}
        >
          {tech.icon} {tech.name}
        </motion.li>
      ))}
    </ul>
  );
};

export default ItemsList;
