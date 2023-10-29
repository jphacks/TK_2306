import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "styles/index.module.css";
import "react-datepicker/dist/react-datepicker.css";
import TimeSlotTable from "./timeslottable";
import CheckBoxGroup from "./checkbox";
import Banner from "../../components/Banner";
import { useForm} from "react-hook-form";
import { get } from "http";

const URL = process.env.API_URL || 'http://localhost:9000';

type UserAttribute = {
  id: number;
  name: string;
};

type DateCandidate = {
  date: string;
  time_from: string;
  time_to: string;
};

const UserPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [userName, setUserName] = useState<string>("");
  const [dates, setDates] = useState<string[]>([]);
  const [attribute, setAttributes] = useState<UserAttribute[]>([]);
  const [candidateTimes, setCandidateTimes] = useState<string[][]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{attr_id: number, value: boolean}[]>([]);
  const { register, control, getValues, setValue } = useForm<{
    dates: {
      from_time: string;
      to_time: string;
    }[][];
  }>({
    defaultValues: { dates: [] },
  });

  useEffect(() => {
    fetch(`${URL}/attrs/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          console.error("Error fetching attributes");
        }
        return await response.json();
      })
      .then(async (response) => {
        setAttributes(response["attrs"]);
        setSelectedOptions(response["attrs"].map((attr: UserAttribute) => ({attr_id: attr.id, value: false})));
        console.log("User attributes:", response["attrs"]);
      });
    
    fetch(`${URL}/dates/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          console.error("Error fetching attributes");
        }
        return await response.json();
      })
      .then(async (response) => {
        const res: DateCandidate[] = response["dates"];
        const dates = new Set(res.map((date: DateCandidate) => date.date));
        const datesArray: string[] = Array.from(dates);
        var candidateTimes: string[][] = datesArray.map(() => []);
        for (var date of res) {
          const index = datesArray.indexOf(date.date);
          candidateTimes[index].push(date.time_from, date.time_to);
        }
        setValue(
          "dates",
          datesArray.map(() => [{ from_time: "", to_time: "" }])
        );
        setDates(datesArray);
        setCandidateTimes(candidateTimes);
      });
  }, [id]);


  const getCandidates = () => {
    const values = getValues();
    var res: { date: string; time_from: string; time_to: string }[] = [];
    values.dates.forEach((date, index) => {
      for (var element of date) {
        res.push({
          date: dates[index],
          time_from: element.from_time,
          time_to: element.to_time,
        });
      }
    });
    return res;
  };

  const getAttributes = () => {
    return selectedOptions.map(option => ({attr_id: option.attr_id, value: option.value}))
  }

  const handleSubmit = async () => {
    console.log("Selected options:", selectedOptions)
    const postData = {
      group_id: id,
      name: userName,
      attrs: getAttributes(),
      dates: getCandidates(),
    };
    console.log("POST Data:", postData);
    const _ = await axios.post(`${URL}/users`,
      postData,
    );
    // // Navigate to the shift confirmation page
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
          <CheckBoxGroup
            options={attribute}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
        </div>
        <div>
          <p>希望日時選択</p>
          <TimeSlotTable
            register={register}
            dates={dates}
            candidateTimes={candidateTimes}
            control={control}
          />
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
