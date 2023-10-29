import React, { useState } from 'react';

type UserAttribute = {
  id: number;
  name: string;
};

type CheckBoxGroupProps = {
  options: UserAttribute[];
  selectedOptions: string[];
  setSelectedOptions: (selectedOptions: string[]) => void;
};

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({ options, selectedOptions, setSelectedOptions }) => {
  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {options?.map((option) => (
        <label key={option.name} style={{ marginBottom: '10px' }}>
          <input
            type="checkbox"
            value={option.name}
            onChange={(e) => {handleCheckboxChange(e)}}
          />
          {option.name}
        </label>
      ))}
    </div>
  );
};

export default CheckBoxGroup;
