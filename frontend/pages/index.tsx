import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Attribute = {
  name: string;
  max_people: number;
  min_people: number;
};

type Candidate = {
  date: string;
  from: string;
  to: string;
  max_people: number;
  min_people: number;
  attr: Attribute[];
  preference: string[];
};

const TopPage: React.FC = () => {
  const [calendarStartDate, setCalendarStartDate] = useState<string>('');
  const [calendarEndDate, setCalendarEndDate] = useState<string>('');
  const [shiftName, setShiftName] = useState<string>('');
  const [groupUrl, setGroupUrl] = useState<string>('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleCreate = () => {
    const Id = uuidv4();
    const generatedUserUrl = `${Id}`;
    setGroupUrl(generatedUserUrl);

    // POST request to save the data to the database
    // You would typically use fetch or axios here to send the data to your server
    const postData = {
      group_id: Id,
      event_name: shiftName,
      candidates,
    };

    console.log('User URL:', generatedUserUrl);
    console.log('POST Data:', postData);
  };

  return (
    <div>
      <h1>シフト管理 - 管理者画面</h1>
      <div>
        <label>
          シフト期間の開始日:
          <input
            type="date"
            value={calendarStartDate}
            onChange={(e) => setCalendarStartDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          シフト期間の終了日:
          <input
            type="date"
            value={calendarEndDate}
            onChange={(e) => setCalendarEndDate(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          シフト表の名前:
          <input
            type="text"
            value={shiftName}
            onChange={(e) => setShiftName(e.target.value)}
          />
        </label>
      </div>
      {/* Add your attributes and candidates input fields here */}
      <button onClick={handleCreate}>作成</button>
      {groupUrl && <div>URL: {groupUrl}</div>}
    </div>
  );
};

export default TopPage;
