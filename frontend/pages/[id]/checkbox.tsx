import React, { useState } from 'react';

type Option = {
  id: string;
  name: string;
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
        <label key={option.name} style={{ marginBottom: '10px' }}>
          <input
            type="checkbox"
            value={option.name}
            checked={selectedOptions.includes(option.name)}
            onChange={handleCheckboxChange}
          />
          {option.name}
        </label>
      ))}
    </div>
  );
};

export default CheckBoxGroup;
