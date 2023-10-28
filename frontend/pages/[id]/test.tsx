import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserPage: React.FC = () => {
  const { control, handleSubmit, register, setValue } = useForm({
    defaultValues: { dates: [{ date: null, time: '' }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dates',
  });

  const onSubmit = (data: any) => {
    // フォームデータを処理するロジックを追加
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((item, index) => (
        <div key={item.id}>
          <label>
            日付:
            <Controller
              name={`dates[${index}].date`}
              control={control}
              render={({ field }) => (
                <DatePicker selected={field.value} onChange={(date) => setValue(`dates[${index}].date`, date)} />
              )}
            />
          </label>
          <label>
            時間:
            <input {...register(`dates[${index}].time`)} />
          </label>
          <button type="button" onClick={() => remove(index)}>
            削除
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ date: null, time: '' })}>
        行を追加
      </button>
      <button type="submit">送信</button>
    </form>
  );
};

export default UserPage;
