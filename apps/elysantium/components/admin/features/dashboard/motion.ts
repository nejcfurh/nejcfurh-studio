// Shared entrance motion for the dashboard grid (container staggers its items).
export const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

export const dashboardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export const dashboardItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT }
  }
};
