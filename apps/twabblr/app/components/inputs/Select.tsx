'use client';

import ReactSelect from 'react-select';

interface SelectOption {
  value: string;
  label: string | null;
}

interface SelectProps {
  label: string;
  value?: SelectOption[];
  onChange: (value: readonly SelectOption[]) => void;
  options: SelectOption[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled
}) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm leading-6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti={true}
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999
            })
          }}
          classNames={{
            control: () => 'text-sm'
          }}
        />
      </div>
    </div>
  );
};

export default Select;
