import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Attribute = {
  name: string;
  max_people: number;
  min_people: number;
};

type Preference = {
  name: string;
  value: string;
};

type Candidate = {
  date: string;
  from: string;
  to: string;
  max_people: number;
  min_people: number;
  attr: Attribute[];
  preference: Preference[];
};

const TopPage: React.FC = () => {
  const [calendarStartDate, setCalendarStartDate] = useState<string>('');
  const [calendarEndDate, setCalendarEndDate] = useState<string>('');
  const [shiftName, setShiftName] = useState<string>('');
  const [groupUrl, setGroupUrl] = useState<string>('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const handleCreate = () => {
    const Id = uuidv4();
    const generatedUserUrl = `${Id}`;
    setGroupUrl(generatedUserUrl);

    const postData = {
      group_id: Id,
      event_name: shiftName,
      candidates,
    };

    console.log('User URL:', generatedUserUrl);
    console.log('POST Data:', postData);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', max_people: 0, min_people: 0 }]);
  };

  const addPreference = () => {
    setPreferences([...preferences, { name: '', value: '' }]);
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

      <button onClick={addAttribute}>Add Attribute</button>
      {attributes.map((attr, index) => (
        <div key={index}>
          <input
            placeholder="Attribute"
            value={attr.name}
            onChange={(e) => {
              const newAttributes = [...attributes];
              newAttributes[index].name = e.target.value;
              setAttributes(newAttributes);
            }}
          />
          <input
            type="number"
            placeholder="Max People"
            value={attr.max_people}
            onChange={(e) => {
              const newAttributes = [...attributes];
              newAttributes[index].max_people = Number(e.target.value);
              setAttributes(newAttributes);
            }}
          />
          <input
            type="number"
            placeholder="Min People"
            value={attr.min_people}
            onChange={(e) => {
              const newAttributes = [...attributes];
              newAttributes[index].min_people = Number(e.target.value);
              setAttributes(newAttributes);
            }}
          />
        </div>
      ))}

      <button onClick={addPreference}>Add Preference</button>
      {preferences.map((pref, index) => (
        <div key={index}>
          <input
            placeholder="Preference"
            value={pref.name}
            onChange={(e) => {
              const newPreferences = [...preferences];
              newPreferences[index].name = e.target.value;
              setPreferences(newPreferences);
            }}
          />
          <input
            placeholder="Value"
            value={pref.value}
            onChange={(e) => {
              const newPreferences = [...preferences];
              newPreferences[index].value = e.target.value;
              setPreferences(newPreferences);
            }}
          />
        </div>
      ))}

      <button onClick={handleCreate}>作成</button>
      {groupUrl && <div>URL: {groupUrl}</div>}
    </div>
  );
};

export default TopPage;
