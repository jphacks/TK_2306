import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import Dialog from "@mui/material/Dialog";
import Banner from "../components/Banner";
import Theme from "../components/Theme";
import DialogTitle from "@mui/material/DialogTitle"; // DialogTitleをインポート
import DialogContent from "@mui/material/DialogContent"; // DialogContentをインポート
import DialogContentText from "@mui/material/DialogContentText"; // DialogContentTextをインポート
import DialogActions from "@mui/material/DialogActions"; // DialogActionsをインポート
import axios from "axios";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const URL = process.env.API_URL || 'http://localhost:9000';

type Attribute = {
  name: string;
  max_people: number;
  min_people: number;
};

type Preference = {
  target: string;
  value: string;
};

type Dates = {
  date: string;
  time_from: string;
  time_to: string;
  max_people: number;
  min_people: number;
  attrs: Attribute[];
  preferences: Preference[];
};

type Group = {
  name: string;
  group_id: string;
  dates: Dates[];
};

type Temp = {
  date: string;
  start: string;
  end: string;
  max: number;
  min: number;
  attr: Attribute[];
  pref: Preference[];
};

const TopPage: React.FC = () => {
  const [shiftName, setShiftName] = useState<string>("");
  const [groupUrl, setGroupUrl] = useState<string>("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [customAttributes, setCustomAttributes] = useState<Attribute[]>([]);
  const [customPreferences, setCustomPreferences] = useState<Preference[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedStart, setSelectedStart] = useState<string>("");
  const [selectedEnd, setSelectedEnd] = useState<string>("");
  const [selectedMax, setSelectedMax] = useState<number>(0);
  const [selectedMin, setSelectedMin] = useState<number>(0);
  const [temp, setTemp] = useState<Temp[]>([]);
  const router = useRouter();

  const handleCreate = () => {
    const Id = uuidv4();
    const generatedUserUrl = `${Id}`;
    setGroupUrl(generatedUserUrl);

    const dates = temp.map((t) => {
      return {
        date: t.date,
        time_from: t.start,
        time_to: t.end,
        max_people: t.max,
        min_people: t.min,
        attrs: t.attr,
        preferences: t.pref,
      };
    });

    const postData = {
      name: shiftName,
      group_id: Id,
      dates: dates,
    };

    const post = async () => {
      const response = await axios.post(
        `${URL}/events`,
        postData
      );
    };

    post();
    router.push(`/${Id}`);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    handlePopupOpen();
  };

  const handlePopupOpen = () => {
    // ... 既存のコード ...

    // ポップアップを表示
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    // ポップアップを閉じる
    setTemp([
      ...temp,
      {
        date: selectedDate,
        start: selectedStart,
        end: selectedEnd,
        max: selectedMax,
        min: selectedMin,
        attr: [...customAttributes, ...attributes],
        pref: [...customPreferences, ...preferences],
      },
    ]);
    setSelectedStart("");
    setSelectedEnd("");
    setSelectedMax(0);
    setSelectedMin(0);
    setCustomAttributes([]);
    setCustomPreferences([]);
    setOpenPopup(false);
  };

  const addCustomAttribute = () => {
    setCustomAttributes([
      ...customAttributes,
      { name: "", max_people: 0, min_people: 0 },
    ]);
  };

  const addCustomPreference = () => {
    setCustomPreferences([...customPreferences, { target: "", value: "" }]);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", max_people: 0, min_people: 0 }]);
  };

  const addPreference = () => {
    setPreferences([...preferences, { target: "", value: "" }]);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Theme>
        <Banner />
        <Typography variant="h4">シフト管理 - 管理者画面</Typography>
        <Box>
          <TextField
            label="シフト表の名前"
            value={shiftName}
            onChange={(e) => setShiftName(e.target.value)}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar onChange={handleDateChange} />
          <Dialog
            open={openPopup}
            onClose={handlePopupClose}
            maxWidth="md"
            style={{ overflow: "auto" }}
          >
            <DialogTitle>
              {dayjs(selectedDate).format("ddd, DD MMM YYYY")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="description of the dialog">
                Please enter the start time, end time, minimum number of people,
                <br /> and maximum number of people for the shift.
              </DialogContentText>
              <DialogContent>
                <TextField
                  label="start time"
                  value={selectedStart}
                  onChange={(e) => setSelectedStart(e.target.value)}
                />
                <br />
                <TextField
                  label="end time"
                  value={selectedEnd}
                  onChange={(e) => setSelectedEnd(e.target.value)}
                />
                <br />
                <TextField
                  label="min"
                  value={selectedMin}
                  onChange={(e) => setSelectedMin(Number(e.target.value))}
                />
                <TextField
                  label="max"
                  value={selectedMax}
                  onChange={(e) => setSelectedMax(Number(e.target.value))}
                />
              </DialogContent>
              <DialogContentText id="description of the attribute">
                You can set the minimum and maximum number of people for each
                attribute.
                <br /> This requirement is always met.
              </DialogContentText>
              <DialogActions style={{ flexDirection: "column" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addCustomAttribute}
                  style={{ marginBottom: "16px" }}
                >
                  Add Attribute
                </Button>
                {customAttributes.map((attr, index) => (
                  <Box key={index}>
                    <TextField
                      label="Attribute"
                      value={attr.name}
                      onChange={(e) => {
                        const newCustomAttributes = [...customAttributes];
                        newCustomAttributes[index].name = e.target.value;
                        setCustomAttributes(newCustomAttributes);
                      }}
                    />
                    <TextField
                      label="Min"
                      value={attr.min_people}
                      onChange={(e) => {
                        const newCustomAttributes = [...customAttributes];
                        newCustomAttributes[index].min_people = Number(
                          e.target.value
                        );
                        setCustomAttributes(newCustomAttributes);
                      }}
                    />
                    <TextField
                      label="Max"
                      value={attr.max_people}
                      onChange={(e) => {
                        const newCustomAttributes = [...customAttributes];
                        newCustomAttributes[index].max_people = Number(
                          e.target.value
                        );
                        setCustomAttributes(newCustomAttributes);
                      }}
                    />
                  </Box>
                ))}
              </DialogActions>
              <DialogContentText id="description of the dialog">
                You can set some constraints for each preferences.
                <br /> This requirement is met as much as possible.
              </DialogContentText>
              <DialogActions style={{ flexDirection: "column" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addCustomPreference}
                  style={{ marginBottom: "16px" }}
                >
                  Add Preference
                </Button>

                {customPreferences.map((pref, index) => (
                  <Box key={index}>
                    <TextField
                      label="Preference"
                      value={pref.target}
                      onChange={(e) => {
                        const newCustomPreferences = [...customPreferences];
                        newCustomPreferences[index].target = e.target.value;
                        setCustomPreferences(newCustomPreferences);
                      }}
                    />
                    <TextField
                      label="Value"
                      value={pref.value}
                      onChange={(e) => {
                        const newCustomPreferences = [...customPreferences];
                        newCustomPreferences[index].value = e.target.value;
                        setCustomPreferences(newCustomPreferences);
                      }}
                    />
                  </Box>
                ))}
              </DialogActions>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={handlePopupClose}
                color="primary"
              >
                Enter
              </Button>
            </DialogActions>
          </Dialog>
        </LocalizationProvider>

        <Button variant="contained" color="primary" onClick={addAttribute}>
          Add Attribute
        </Button>

        {attributes.map((attr, index) => (
          <Box key={index}>
            <TextField
              label="name"
              value={attr.name}
              onChange={(e) => {
                const newAttributes = [...attributes];
                newAttributes[index].name = e.target.value;
                setAttributes(newAttributes);
              }}
            />
            <TextField
              label="Min"
              value={attr.min_people}
              onChange={(e) => {
                const newAttributes = [...attributes];
                newAttributes[index].max_people = Number(e.target.value);
                setAttributes(newAttributes);
              }}
            />
            <TextField
              label="Max"
              value={attr.max_people}
              onChange={(e) => {
                const newAttributes = [...attributes];
                newAttributes[index].max_people = Number(e.target.value);
                setAttributes(newAttributes);
              }}
            />
          </Box>
        ))}

        <Button variant="contained" color="primary" onClick={addPreference}>
          Add Preference
        </Button>

        {preferences.map((pref, index) => (
          <Box key={index}>
            <TextField
              label="Preference"
              value={pref.target}
              onChange={(e) => {
                const newPreferences = [...preferences];
                newPreferences[index].target = e.target.value;
                setPreferences(newPreferences);
              }}
            />
            <TextField
              label="Value"
              value={pref.value}
              onChange={(e) => {
                const newPreferences = [...preferences];
                newPreferences[index].value = e.target.value;
                setPreferences(newPreferences);
              }}
            />
          </Box>
        ))}

        <Button variant="contained" color="secondary" onClick={handleCreate}>
          作成
        </Button>
      </Theme>
    </Container>
  );
};

export default TopPage;
