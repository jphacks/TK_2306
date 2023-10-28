import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import styles from 'styles/index.module.css';

type TimeSlotTableProps = {
  dates: Date[];
  candidateTimes: string[];
  onPreferenceChange: (from_time: string, to_time: string) => void;
};

const TimeSlotTable: React.FC<TimeSlotTableProps> = ({ dates, candidateTimes, onPreferenceChange }) => {
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: { dates: [{ from_time: '', to_time: '' }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dates',
  });

  return (
    <table className={styles.timeSlotTable}>
      <thead>
        <tr>
          <th>日付</th>
          <th>候補時間</th>
          <th>希望時間</th>
        </tr>
      </thead>
      <tbody>
        {dates.map((date, index) => (
          <tr key={index}>
            <td>{date.toLocaleDateString()}</td>
            <td className="time_container">
              <span className={styles.candidateTime}>
                {candidateTimes[index][0]} ~ {candidateTimes[index][1]}
              </span>
            </td>
            <td className="time_container">
              {Array.from({ length: candidateTimes.length / 2 }, (_, idx) => idx * 2).map((startIndex) => {
                const endIndex = startIndex + 1;
                const time1 = candidateTimes[startIndex];
                const time2 = candidateTimes[endIndex];
                return (
                  <span key={startIndex} className={styles.candidateTime}>
                    {`${time1} ~ ${time2}`}
                  </span>
                );
              })}
            </td>
            <td>
            <div className={styles.time_op}>
              {Array.from({ length: 1 }, (_, index) => (
                <div className={styles.timeContainer} key={index}>
                  <input className={styles.timeInput} {...register(`dates[${index}].from_time`)} />
                  <p> ~ </p>
                  <input className={styles.timeInput} {...register(`dates[${index}].to_time`)} />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => append({ from_time: '', to_time: '' })}>
              行を追加
            </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TimeSlotTable;
