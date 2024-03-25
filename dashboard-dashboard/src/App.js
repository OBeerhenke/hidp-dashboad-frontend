import React, { useState } from 'react';
import ProcessDropdown from './ProcessDropdown';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Button, Grid, TextField } from '@mui/material';
import { subDays } from 'date-fns';

const App = () => {
  const [chartData, setChartData] = useState({});
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  

  const uniformHeightStyle = {
    height: '56px', // Adjust this value based on your needs
    '.MuiInputBase-root': { height: '100%' }, // Ensures inner elements also match the height
    '.MuiOutlinedInput-input': { height: '100%' },
    '.MuiButton-root': { height: '100%' },
  };

  const handleProcessSelected = (processId) => {
    setSelectedProcessId(processId);
  };

  // Adjust these handlers for date changes
  const startDateDefault = subDays(new Date(), 14);
  const endDateDefault = new Date();

  const [startDate, setStartDate] = useState(startDateDefault);
  const [endDate, setEndDate] = useState(endDateDefault);

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };


  const generateChartData = async () => {
    if (!selectedProcessId || !startDate || !endDate) {
      alert('Please select a process and a date range.');
      return;
    }

    // Fetch the work items for the selected process ID
    const workItemsResponse = await fetch(`http://localhost:3000/api/workitems/${selectedProcessId}`);
    const workItems = await workItemsResponse.json();

    // Filter work items by date range
    const filteredItems = workItems.filter((item) => {
      const doneTime = new Date(item.WorkItemDoneTime);
      return doneTime >= startDate && doneTime <= endDate;
    });

    console.log(filteredItems)

    // Extract IDs from filteredItems for the batch request
    const workItemIds = filteredItems.map(item => item.ID);

    console.log(filteredItems);

    // Fetch activity statistics in batch for the filtered work items
    const activityStatsResponse = await fetch('http://localhost:3000/api/activitystatistics/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workItemIds),
    });
    const activityStatistics = await activityStatsResponse.json();

    // Process and set chart data
    processDataForChart(activityStatistics);
  };

  const processDataForChart = (activityStatistics) => {
    const activityData = activityStatistics.reduce((acc, curr) => {
      const { ActivityName, Duration } = curr;
      if (!acc[ActivityName]) {
        acc[ActivityName] = { totalDuration: 0, count: 0 };
      }
      acc[ActivityName].totalDuration += Duration;
      acc[ActivityName].count += 1;
      return acc;
    }, {});

    const newChartData = {
      labels: Object.keys(activityData),
      datasets: [{
        label: 'Average Duration (s)',
        data: Object.values(activityData).map(d => (d.totalDuration / d.count).toFixed(2)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };

    

    setChartData(newChartData);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs = {4}>
            <ProcessDropdown sx={uniformHeightStyle} onProcessSelected={handleProcessSelected} />
          </Grid>
          <Grid item xs = {2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs = {2}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <Button  sx={uniformHeightStyle} variant="outlined" onClick={generateChartData}>
              Generate Chart
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
      {chartData.labels && (
        <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
      )}
    </div>
  );
};

export default App;