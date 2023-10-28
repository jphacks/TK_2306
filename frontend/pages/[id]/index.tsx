import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from 'styles/index.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeSlotTable from './timeslottable';

type UserAttribute = {
  name: string;
};

type UserPreference = {
  name: string;
};

type TimeSlotTableProps = {
  dates: Date[];
  candidateTimes: string[];
  onPreferenceChange: (date: Date, time: string) => void;
};

type UserShift = {
  date: string;
  from: string;
  to: string;
  status: '○' | '△' | '×';
};

const UserPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [userName, setUserName] = useState<string>('');
  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<number | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);

  const dates = [new Date('2023-11-01'), new Date('2023-11-02'), new Date('2023-11-03')];
  const candidateTimes = [
    ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"],
    ["08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM"]
  ];


  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get(`/api/attributes`);
        setUserAttributes(response.data);
      } catch (error) {
        console.error('Error fetching attributes: ', error);
      }
    };

    fetchAttributes();
  }, []);


  const handleSubmit = () => {
    // POST request to save the user input to the database
    // You would typically use fetch or axios here to send the data to your server
    const postData = {
      group_id: id,
      event_name: userName,
      attr: userAttributes,
      candidates: userShifts,
    };

    console.log('POST Data:', postData);

    // Navigate to the shift confirmation page
    router.push(`/${id}/shift`);
  };

  const handlePreferenceChange = (date: Date, time: string) => {
    // ユーザーの希望時間が変更されたときの処理
    // ...
  };

  return (
    <div className={styles.container}>
      <h1>シフト入力画面</h1>
      <div className={styles.formsection}>
        <div className={styles.inputcontainer}>
          <label>
            name
            <input
              className={styles.nameinput}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className={styles.formsection}>
        <select
          multiple
          value={selectedAttribute || ''}
          onChangeCapture={(e) => setSelectedAttribute(parseInt(e.target.value, 10))}
        >
          {userAttributes.map((attribute) => (
            <option key={attribute.id} value={attribute.id}>
              {attribute.name}
            </option>
          ))}
        </select>
      </div>
      <div>
      <h1>希望日時選択</h1>
      <TimeSlotTable dates={dates} candidateTimes={candidateTimes} onPreferenceChange={handlePreferenceChange} />
      {/* 他の入力フィールドやボタンを追加 */}
    </div>
    </div>
  );
};

export default UserPage;
