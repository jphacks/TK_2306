import React, { useState } from 'react';
import { useRouter } from 'next/router';

type UserAttribute = {
  name: string;
};

type UserPreference = {
  name: string;
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
  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);

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

  return (
    <div>
      <h1>シフト入力画面</h1>
      <div>
        <label>
          名前:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
      </div>
      {/* Add your attributes, preferences, and shifts input fields here */}
      <button onClick={handleSubmit}>シフト生成</button>
    </div>
  );
};

export default UserPage;
