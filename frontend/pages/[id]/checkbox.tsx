import React, { useState } from "react";

type UserAttribute = {
  id: number;
  name: string;
};

type CheckBoxGroupProps = {
  options: UserAttribute[];
  selectedOptions: { attr_id: number; value: boolean }[];
  setSelectedOptions: (
    selectedOptions: { attr_id: number; value: boolean }[]
  ) => void;
};

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    console.log("value", value);
    // setSelectedOptions(prev => ({
    //   ...prev,
    //   [index]: { attr_id: prev[index].attr_id, value: !prev[index].value },
    // }));
    selectedOptions[index].value = !selectedOptions[index].value;
    setSelectedOptions(selectedOptions);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {options?.map((option, index) => (
        <label key={option.id} style={{ marginBottom: "10px" }}>
          <input
            type="checkbox"
            value={option.name}
            onChange={(e) => {
              handleCheckboxChange(e, index);
            }}
          />
          {option.name}
        </label>
      ))}
    </div>
  );
};

export default CheckBoxGroup;
