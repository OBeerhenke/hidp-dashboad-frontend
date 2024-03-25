import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ActivitiesList = ({ selectedProcessId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (selectedProcessId) {
      fetch(`http://localhost:3000/api/processes/${selectedProcessId}`)
        .then(response => response.json())
        .then(data => {setActivities(data);
        console.log(data);})
        .catch(error => console.error('Error fetching activities:', error));
    }
  }, [selectedProcessId]); // Dependency array includes selectedProcessId to refetch when it changes

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="activities table">
        <TableHead>
          <TableRow>
            <TableCell>Activity Name</TableCell>
            <TableCell align="right">Start Date/Time</TableCell>
            <TableCell align="right">End Date/Time</TableCell>
            <TableCell align="right">Duration (seconds)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((activity) => (
            <TableRow
              key={activity.ID} // Assuming your activities have an ID; adjust as needed
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{activity.ActivityName}</TableCell>
              <TableCell align="right">{activity.StartDateTime}</TableCell>
              <TableCell align="right">{activity.EndDateTime}</TableCell>
              <TableCell align="right">{activity.Duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivitiesList;
