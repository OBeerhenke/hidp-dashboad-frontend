import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProcessDropdown = ({ onProcessSelected }) => {
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/processes')
      .then(res => res.json())
      .then(data => {
        const sortedData = data.sort((a, b) => {
          // Assuming ProcessName is the property you want to sort by
          return a.ProcessName.localeCompare(b.ProcessName);
        });
        setProcesses(sortedData);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedProcess(value);

    // Splitting the value back into ID and name
    const [processId, processName] = value.split('|');
    onProcessSelected(processId, processName);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="process-dropdown-label">Process</InputLabel>
      <Select
        labelId="process-dropdown-label"
        id="process-dropdown"
        value={selectedProcess}
        label="Process"
        onChange={handleChange}
        renderValue={(selected) => selected.split('|')[1]} // Displaying the processName
      >
        {processes.map((process) => (
          // Concatenating processId and processName to form a unique value
          <MenuItem key={`${process.ProcessId}|${process.ProcessName}`} value={`${process.ProcessId}|${process.ProcessName}`}>
            {process.ProcessName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProcessDropdown;