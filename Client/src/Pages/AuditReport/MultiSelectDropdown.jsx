import Multiselect from 'multiselect-react-dropdown';

const MultiSelectDropdown = ({ agent, selectedValues, setSelectedValues }) => {

  let agentObjects=[];
  if (agent?.some(item => item.hasOwnProperty('SCHEMA_NAME'))) {
    agentObjects = agent?.map(item => ({ title: item.SCHEMA_NAME, value: item.SCHEMA_NAME }));
  } else if(agent?.some(item => item.hasOwnProperty('functionname'))){
    agentObjects = agent?.map(item => ({ title: item.functionname, value: item.functionname }));
  } else if(agent?.some(item => item.hasOwnProperty('FULLNAME'))){
    agentObjects = agent?.map(item => ({ title: item.FULLNAME, value: item.FULLNAME }));
  }
  const handleSelection = (selectedList) => {
    setSelectedValues(selectedList);
  };

  return (
    <Multiselect
      options={agentObjects}
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
