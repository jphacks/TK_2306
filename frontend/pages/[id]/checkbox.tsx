import React, { useState } from 'react';

type Option = {
  label: string;
  value: string;
};

type CheckBoxGroupProps = {
  options: Option[];
  onChange: (selectedOptions: string[]) => void;
};

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
    onChange(selectedOptions);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {options?.map((option) => (
        <label key={option.value} style={{ marginBottom: '10px' }}>
          <input
            type="checkbox"
            value={option.value}
            checked={selectedOptions.includes(option.value)}
            onChange={handleCheckboxChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default CheckBoxGroup;
