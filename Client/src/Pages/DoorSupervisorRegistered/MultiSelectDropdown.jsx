import React from 'react';
import Multiselect from 'multiselect-react-dropdown';

const MultiSelectDropdown = ({ agent, selectedValues, setSelectedValues }) => {

  const handleSelection = (selectedList) => {
    setSelectedValues(selectedList);
  };

  return (
    <Multiselect
      options={agent}
      onSelect={handleSelection}
      onRemove={handleSelection}
      displayValue="value"
      selectedValues={selectedValues}
      placeholder="Select options"
      showCheckbox={true}
    />
  );
};

export default MultiSelectDropdown;
