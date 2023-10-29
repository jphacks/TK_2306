import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller, useFieldArray, Control, UseFormRegister, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form';
import styles from 'styles/index.module.css';

type ShiftConfirmationTableProps = {
  dates: string[];
  candidateTimes: string[][];
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

const ShiftConfirmationTable: React.FC<ShiftConfirmationTableProps> = ({ dates, candidateTimes}) => {

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
      </tbody>
    </table>
  );
};

export default ShiftConfirmationTable;

