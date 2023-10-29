import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import styles from "styles/index.module.css";

type TimeCandidateListProps = {
  date: string;
  candidateTime: string[];
  register: UseFormRegister<{
    dates: {
      from_time: string;
      to_time: string;
    }[][];
  }>;
  control: Control<
    {
      dates: {
        from_time: string;
        to_time: string;
      }[][];
    },
    any
  >;
  index: number;
  key: number;
};

type TimeSlotTableProps = {
  dates: string[];
  candidateTimes: string[][];
  register: UseFormRegister<{
    dates: {
      from_time: string;
      to_time: string;
    }[][];
  }>;
  control: Control<
    {
      dates: {
        from_time: string;
        to_time: string;
      }[][];
    },
    any
  >;
};

const TimeCandidateList: React.FC<TimeCandidateListProps> = ({
  date,
  candidateTime,
  register,
  control,
  index,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `dates.${index}`,
  });
  return (
    <tr key={index}>
      <td>{date}</td>
      <td>
        {Array.from({ length: candidateTime.length / 2 }, (_, idx) => idx * 2)
          .slice(0, 4)
          ?.map((startIndex) => {
            const endIndex = startIndex + 1;
            const time1 = candidateTime[startIndex];
            const time2 = candidateTime[endIndex];
            return (
              <span key={startIndex} className={styles.candidateTime}>
                {`${time1} ~ ${time2}`}
              </span>
            );
          })}
      </td>
      <td>
        {fields.map((item, f_index) => (
          <div className={styles.time_op} key={item.id}>
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
                <button type="button" onClick={() => remove(f_index)}>
                  削除
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            append({ from_time: "", to_time: "" });
          }}
        >
          行を追加
        </button>
      </td>
    </tr>
  );
};

const TimeSlotTable: React.FC<TimeSlotTableProps> = ({
  dates,
  candidateTimes,
  register,
  control,
}) => {
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
        {dates?.map((_, index) => (
          <TimeCandidateList
            control={control}
            index={index}
            register={register}
            date={dates[index]}
            candidateTime={candidateTimes[index]}
            key={index}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TimeSlotTable;
