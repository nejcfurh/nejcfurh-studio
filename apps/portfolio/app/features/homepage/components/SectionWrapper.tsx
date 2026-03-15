import { JSX, ComponentType } from "react";
import AnimatedSection from "@/app/components/motion/AnimatedSection";
import { staggerContainer } from "../utils/variants";

const SectionWrapper = <P extends object>(
  Component: ComponentType<P>,
  idName: string,
): ComponentType<P> => {
  const WrappedComponent = (props: P): JSX.Element => {
    return (
      <AnimatedSection
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-0"
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        <Component {...props} />
      </AnimatedSection>
    );
  };

  return WrappedComponent;
};

export default SectionWrapper;
