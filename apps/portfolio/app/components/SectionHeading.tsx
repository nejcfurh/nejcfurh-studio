"use client";

import { motion } from "framer-motion";
import { JSX } from "react";

interface SectionHeadingProps {
  label: string;
  title: string;
  align?: "left" | "center";
}

const SectionHeading = ({
  label,
  title,
  align = "left",
}: SectionHeadingProps): JSX.Element => {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-16 ${alignClass}`}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-secondary text-sm uppercase tracking-[0.2em] font-mono mb-4"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-white-100 font-bold md:text-[56px] sm:text-[48px] xs:text-[40px] text-[32px] tracking-tight"
      >
        {title}
      </motion.h2>
    </div>
  );
};

export default SectionHeading;
