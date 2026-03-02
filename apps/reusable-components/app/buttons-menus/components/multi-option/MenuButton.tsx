const MenuButton = ({
  handleToggle,
  isOpen,
}: {
  handleToggle: () => void;
  isOpen: boolean;
}) => {
  return (
    <button
      className="menu-open-button"
      onClick={handleToggle}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <span className="hamburger hamburger-1"></span>
      <span className="hamburger hamburger-2"></span>
      <span className="hamburger hamburger-3"></span>
    </button>
  );
};

export default MenuButton;
