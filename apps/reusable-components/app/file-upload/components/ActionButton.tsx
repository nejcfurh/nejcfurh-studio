const ActionButton = ({
  type,
  className,
}: {
  type: 'reset' | 'submit';
  className: string;
}) => {
  return (
    <button type={type} className={className}>
      <span className="inline-block transition-transform duration-300 group-hover:scale-105">
        {type === 'reset' ? 'Cancel' : 'Save'}
      </span>
    </button>
  );
};

export default ActionButton;
