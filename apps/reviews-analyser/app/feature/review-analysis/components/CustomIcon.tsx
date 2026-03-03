import { FaMinus, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const CustomIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'thumbs-up':
      return <FaThumbsUp className="w-4 h-4" />;
    case 'thumbs-down':
      return <FaThumbsDown className="w-4 h-4" />;
    case 'minus':
      return <FaMinus className="w-4 h-4" />;
    default:
      return <FaMinus className="w-4 h-4" />;
  }
};

export default CustomIcon;
