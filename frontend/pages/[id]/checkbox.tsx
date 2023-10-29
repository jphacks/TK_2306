import React, { useState } from 'react';

const CheckBoxGroup = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
    onChange(selectedOptions);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column'}}>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="checkbox"
            value={option.value}
            checked={selectedOptions.includes(option.value)}
            onChange={handleCheckboxChange}
            style={{ marginTop: '10px'}}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default CheckBoxGroup;