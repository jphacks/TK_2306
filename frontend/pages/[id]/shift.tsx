import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import Banner from "../../components/Banner";
import Theme from '../../components/Theme';

type ConfirmedShift = {
  date: string;
  from: string;
  to: string;
};

const ShiftConfirmationPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [confirmedShifts, setConfirmedShifts] = useState<ConfirmedShift[]>([]);
  const [userName, setUserName] = useState<string>('');

  // Fetch the confirmed shifts for the user from the database when the component mounts
  useEffect(() => {
    // Replace this with an actual API call to fetch the data
    // For demonstration, we're using hardcoded data
    setConfirmedShifts([
      { date: '2023-11-01', from: '09:00', to: '17:00' },
      { date: '2023-11-02', from: '10:00', to: '18:00' },
    ]);
    setUserName('John Doe');
  }, []);

  const handleAddToGoogleCalendar = () => {
    // Logic to add the confirmed shifts to Google Calendar
    console.log('Adding to Google Calendar:', confirmedShifts);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Theme>
        <Banner />
        <Container maxWidth={false} sx={{ paddingTop: 2, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 }}>
          <Typography variant="h4">シフト確認画面</Typography>

          <Box display="flex" justifyContent="center">
            <TableContainer component={Paper} style={{ width: '80%', maxWidth: '1000px' }}>
              <Table stickyHeader >
                <TableBody>
                  <TableRow  >
                    <TableCell sx={{ backgroundColor: 'rgba(217, 217, 217, 0.38)',color: 'black' }}>{" "}</TableCell>
                    <TableCell sx={{ backgroundColor: 'lightgrey', borderLeft: '1px solid black' }}>{"2023/11/01"}</TableCell>
                    <TableCell sx={{ backgroundColor: 'lightgrey',orderLeft: '1px solid black' }}>{"2023/11/02"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'rgba(217, 217, 217, 0.38)',orderLeft: '1px solid black' }}>{" "}</TableCell>
                    <TableCell sx={{ backgroundColor: 'lightgrey',borderLeft: '1px solid black' }}>{"9:00"}~{"17:00"}</TableCell>
                    <TableCell sx={{ backgroundColor: 'lightgrey',borderLeft: '1px solid black' }}>{"10:00"}~{"18:00"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'lightgrey',orderLeft: '1px solid black' }}>{userName}</TableCell>
                    {confirmedShifts.map((shift, index) => (
                      <React.Fragment key={index}>
                        <TableCell sx={{ borderLeft: '1px solid black' }}>{shift.from}~{shift.to}</TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleAddToGoogleCalendar} style={{ marginTop: '10px', width: '200px', height: '50px' }}>
              New Register
            </Button>
          </Box>
          <Box mt={20} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleAddToGoogleCalendar} style={{ marginTop: '10px', width: '400px', height: '70px' }}>
              Go
            </Button>
          </Box>
        </Container>
      </Theme>
    </Container>


  );
};

export default ShiftConfirmationPage;






