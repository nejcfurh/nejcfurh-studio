import { FaMinus, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const CustomIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'thumbs-up':
      return <FaThumbsUp className="h-4 w-4" />;
    case 'thumbs-down':
      return <FaThumbsDown className="h-4 w-4" />;
    case 'minus':
      return <FaMinus className="h-4 w-4" />;
    default:
      return <FaMinus className="h-4 w-4" />;
  }
};

export default CustomIcon;
