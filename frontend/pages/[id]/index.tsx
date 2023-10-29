import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from 'styles/index.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import TimeSlotTable from './timeslottable';
import CheckBoxGroup from './checkbox';
import Banner from "../../components/Banner";

type UserAttribute = {
  name: string;
};

type UserPreference = {
  name: string;
};

type TimeSlotTableProps = {
  dates: Date[][];
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
  const [selectedAttribute, setSelectedAttribute] = useState<string[]>([]);
  const handleSelectionChange = (selectedValues: string[]) => {
    setSelectedAttribute(selectedValues);
  };
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);

  const dates = [new Date('2023-11-01'), new Date('2023-11-02'), new Date('2023-11-03')];
  const candidateTimes = [
    ["09:00", "09:30", "10:00", "10:30"],
    ["08:30", "09:00", "09:30", "10:00"],
    ["13:00", "14:00"]
  ];
  const attribute = [
    { label: '男性', value: '男性' },
    { label: '女性', value: '女性' },
    { label: '係長', value: '係長' },
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

  const handlePreferenceChange = (from_time: string, to_time: string) => {
    // ユーザーの希望時間が変更されたときの処理
    // ...
  };

  return (
    <div>
      <Banner />
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
          <p>属性選択</p>
          <CheckBoxGroup options={attribute} onChange={handleSelectionChange} />
        </div>
        <div>
        <p>希望日時選択</p>
          <TimeSlotTable dates={dates} candidateTimes={candidateTimes} onPreferenceChange={handlePreferenceChange} />
      </div>
      <div className={styles.buttonContainer}>
          <button className={styles.createButton} onClick={handleSubmit}>
            シフト生成
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
