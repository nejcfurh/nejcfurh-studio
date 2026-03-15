export const textVariant = (delay?: number) => {
  return {
    hidden: {
      y: 30,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8,
        delay: delay,
      },
    },
  };
};

export const fadeIn = (
  direction: string,
  type: string,
  delay: number,
  duration: number,
) => {
  return {
    hidden: {
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
};

export const zoomIn = (delay: number, duration: number) => {
  return {
    hidden: {
      scale: 0.9,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay: delay,
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
};

export const slideIn = (
  direction: string,
  type: string,
  delay: number,
  duration: number,
) => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
};

export const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number,
) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren || 0.1,
        delayChildren: delayChildren || 0,
      },
    },
  };
};

export const letterReveal = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

export const scaleOnScroll = (delay: number = 0) => ({
  hidden: { scale: 0.95, opacity: 0, y: 30 },
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      delay,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});
