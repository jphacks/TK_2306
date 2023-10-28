// pages/index.tsx
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TopPage = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [useDefault, setUseDefault] = useState(false);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [people, setPeople] = useState({min: '', max: ''});
  const [attributes, setAttributes] = useState([{ value: '', neededFrom: '', neededTo: '' }]);
  const [preferences, setPreferences] = useState([{ preference: '', condition: '' }]);
  
  const handleCreate = () => {
    // ここにPOSTリクエストのロジックを追加
  }

  const addAttribute = () => {
    setAttributes([...attributes, { value: '', neededFrom: '', neededTo: '' }]);
  };

  const addPreference = () => {
    setPreferences([...preferences, { preference: '', condition: '' }]);
  };

  return (
    <div className="container">
      <h1>Junan Shift</h1>
      <div>
        <label>Event name</label>
        <input 
          type="text" 
          value={eventName} 
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      {/* <div>
        <label>Event Date</label>
        <DatePicker selected={eventDate} onChange={(date: Date) => setEventDate(date)} />
      </div> */}
      {/* <div>
        <input 
          type="checkbox" 
          checked={useDefault}
          onChange={() => setUseDefault(prev => !prev)}
        />
        <label>Use Default Settings</label>
      </div> */}
      {useDefault && (
        <div>
          <label>from</label>
          <select value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
            {/* ここに時間の選択肢を追加 */}
          </select>
          <label>to</label>
          <select value={toTime} onChange={(e) => setToTime(e.target.value)}>
            {/* ここに時間の選択肢を追加 */}
          </select>
          <label>people</label>
          <input type="number" value={people.min} onChange={(e) => setPeople({...people, min: e.target.value})} />
          <span>~</span>
          <input type="number" value={people.max} onChange={(e) => setPeople({...people, max: e.target.value})} />
          {/* 属性とpreferenceの追加ボタンもここに追加 */}
          {/* <div>
            {attributes.map((attr, index) => (
              <div key={index}>
                <input
                  placeholder="attributes"
                  value={attr.value}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[index].value = e.target.value;
                    setAttributes(newAttributes);
                  }}
                />
                <input
                  placeholder="needed"
                  value={attr.neededFrom}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[index].neededFrom = e.target.value;
                    setAttributes(newAttributes);
                  }}
                />
                <span>~</span>
                <input
                  value={attr.neededTo}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[index].neededTo = e.target.value;
                    setAttributes(newAttributes);
                  }}
                />
              </div>
            ))}
            <button onClick={addAttribute}>+ add attribute</button>
          </div> */}
          <button onClick={addPreference}>+ add preference</button>
        </div>
      )}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default TopPage;
