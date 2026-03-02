import { MenuItem } from '@/features/buttons-menus/multi-option-button/types';

const OptionButton = ({
  item,
  index,
  handleItemClick,
}: {
  item: MenuItem;
  index: number;
  handleItemClick: (item: MenuItem) => void;
}) => {
  return (
    <button
      key={index}
      className="menu-item"
      onClick={() => handleItemClick(item)}
      aria-label={item.label}
    >
      {item.icon}
    </button>
  );
};

export default OptionButton;
