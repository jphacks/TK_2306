import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Banner from "../../components/Banner";

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

  const handleAddToGoogleCalendar = async () => {
    console.log('Adding to Google Calendar:', confirmedShifts);
  };

  return (
    <div>
      <Banner />
      <div>
        <h1>シフト確認画面</h1>
        <h2>{userName}</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {confirmedShifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.date}</td>
                <td>{shift.from}</td>
                <td>{shift.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddToGoogleCalendar}>Google Calendarに登録</button>
      </div>
    </div>
  );
};

export default ShiftConfirmationPage;
