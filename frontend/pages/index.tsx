import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import Dialog from "@mui/material/Dialog";
import PopupContent from "./PopupContent";
import Banner from '../components/Banner';

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
  const [shiftName, setShiftName] = useState<string>("");
  const [groupUrl, setGroupUrl] = useState<string>("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [openPopup, setOpenPopup] = useState(false);

  const handleCreate = () => {
    const Id = uuidv4();
    const generatedUserUrl = `${Id}`;
    setGroupUrl(generatedUserUrl);

    const postData = {
      group_id: Id,
      event_name: shiftName,
      // ... other fields
    };

    console.log("User URL:", generatedUserUrl);
    console.log("POST Data:", postData);
  };

  const handlePopupOpen = () => {
    // ... 既存のコード ...

    // ポップアップを表示
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    // ポップアップを閉じる
    setOpenPopup(false);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", max_people: 0, min_people: 0 }]);
  };

  const addPreference = () => {
    setPreferences([...preferences, { name: "", value: "" }]);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handlePopupOpen();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#D9D9D9",
      },
    },
  });

  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Banner/>
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
          <Dialog open={openPopup} onClose={handlePopupClose}>
            <PopupContent onClose={handlePopupClose} />
          </Dialog>
        </LocalizationProvider>

        <Button variant="contained" color="primary" onClick={addAttribute}>
          Add Attribute
        </Button>
        {/* ... same for attributes and preferences ... */}
        {attributes.map((attr, index) => (
          <Box key={index}>
            <TextField
              label="Attribute"
              value={attr.name}
              onChange={(e) => {
                const newAttributes = [...attributes];
                newAttributes[index].name = e.target.value;
                setAttributes(newAttributes);
              }}
            />
            <TextField
              label="Max People"
              type="number"
              value={attr.max_people}
              onChange={(e) => {
                const newAttributes = [...attributes];
                newAttributes[index].max_people = Number(e.target.value);
                setAttributes(newAttributes);
              }}
            />
            <TextField
              label="Min People"
              type="number"
              value={attr.min_people}
              onChange={(e) => {
                const newAttributes = [...attributes];
                newAttributes[index].min_people = Number(e.target.value);
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
              value={pref.name}
              onChange={(e) => {
                const newPreferences = [...preferences];
                newPreferences[index].name = e.target.value;
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

        {groupUrl && <Typography variant="body1">URL: {groupUrl}</Typography>}
      </ThemeProvider>
    </Container>
  );
};

export default TopPage;
