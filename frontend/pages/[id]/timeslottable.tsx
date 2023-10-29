import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller, useFieldArray, Control, UseFormRegister, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form';
import styles from 'styles/index.module.css';

type TimeSlotTableProps = {
  dates: string[];
  candidateTimes: string[][];
  register: UseFormRegister<{
    dates: {
        from_time: string;
        to_time: string;
    }[][];
  }>;
  control: Control<{
    dates: {
        from_time: string;
        to_time: string;
    }[][];
}, any>
  // onPreferenceChange: (from_time: string, to_time: string) => void;
};

type ControlProps = {
  fields: FieldArrayWithId<{
    dates: {
        from_time: string;
        to_time: string;
    }[][];
}, `dates.${number}`, "id">[];
append: UseFieldArrayAppend<{
  dates: {
      from_time: string;
      to_time: string;
  }[][];
}, `dates.${number}`>;
  remove: UseFieldArrayRemove;
};

const TimeSlotTable: React.FC<TimeSlotTableProps> = ({ dates, candidateTimes, register, control }) => {
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'dates',
  // });
  const all_list : ControlProps[] = dates.map((_, index) => { const {fields, append, remove} = useFieldArray({
    control,
    name: `dates.${index}`},
  ); return {fields: fields, append: append, remove: remove};});

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
        {all_list?.map((all, index) => (
          <tr key={index}>
            <td>{dates[index]}</td>
            <td>
              {Array.from({ length: candidateTimes[index].length / 2 }, (_, idx) => idx * 2).slice(0, 4)?.map((startIndex) => {
                  const endIndex = startIndex + 1;
                  const time1 = candidateTimes[index][startIndex];
                  const time2 = candidateTimes[index][endIndex];
                  return (
                    <span key={startIndex} className={styles.candidateTime}>
                      {`${time1} ~ ${time2}`}
                    </span>
                  );
                })}
            </td>
            <td>
              {all.fields.map((item, f_index) => (
                <div className={styles.time_op}>
                  <div>
                    <div className={styles.timeContainer}>
                      <input
                        className={styles.timeInput}
                        {...register(`dates.${index}.${f_index}.from_time`)}
                      />
                      <p> ~ </p>
                      <input
                        className={styles.timeInput}
                        {...register(`dates.${index}.${f_index}.to_time`)}
                      />
                      <button type="button" onClick={() => all.remove(f_index)}>
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => {all.append({ from_time: '', to_time: '' }); }}>
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
