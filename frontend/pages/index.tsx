import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  dateCalendarClasses,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import Dialog from "@mui/material/Dialog";
import Banner from "../components/Banner";
import Theme from "../components/Theme";
import DialogTitle from "@mui/material/DialogTitle"; // DialogTitleをインポート
import DialogContent from "@mui/material/DialogContent"; // DialogContentをインポート
import DialogActions from "@mui/material/DialogActions"; // DialogActionsをインポート
import { styled } from "@mui/material/styles";
import { type } from "os";
import axios from 'axios';
import { useRouter } from 'next/router';

type Attribute = {
  name: string;
  max_people: number;
  min_people: number;
};

type Preference = {
  name: string;
  value: string;
};

type Dates = {
  date: string;
  from: string;
  to: string;
  max_people: number;
  min_people: number;
  attr: Attribute[];
  preference: Preference[];
};

type Group = {
  name: string;
  group_id: string;
  dates: Dates[];
};

const DateDetail1 = styled("div")({
  backgroundColor: `rgba(217, 217, 217, 0.38)`,
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `600px`,
  height: `1492px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  overflow: `hidden`,
});

const Q20231029 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `40px`,
  letterSpacing: `0.4px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `360px`,
  height: `60px`,
  position: `absolute`,
  left: `28px`,
  top: `21px`,
});

const Rectangle7 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 0.75)`,
  width: `547px`,
  height: `518px`,
  position: `absolute`,
  left: `19px`,
  top: `99px`,
});

const From = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `66px`,
  top: `155px`,
});

const Section = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `36px`,
  letterSpacing: `0.36px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `161px`,
  height: `60px`,
  position: `absolute`,
  left: `28px`,
  top: `96px`,
});

const To = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `66px`,
  top: `215px`,
});

const Group1 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  left: `203px`,
  top: `175px`,
});

const Rectangle4 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Polygon1 = styled("img")({
  height: `20px`,
  width: `20px`,
  position: `absolute`,
  left: `291px`,
  top: `42px`,
});

const Group2 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  left: `203px`,
  top: `233px`,
});

const Rectangle41 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Polygon11 = styled("img")({
  height: `20px`,
  width: `20px`,
  position: `absolute`,
  left: `291px`,
  top: `42px`,
});

const Group11 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `130px`,
  height: `24px`,
  left: `336px`,
  top: `505px`,
});

const Rectangle42 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `130px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Polygon12 = styled("img")({
  height: `20px`,
  width: `20px`,
  position: `absolute`,
  left: `145px`,
  top: `42px`,
});

const Group7 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  left: `203px`,
  top: `299px`,
});

const Rectangle43 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const People = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `63px`,
  top: `281px`,
});

const Q = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `31px`,
  height: `60px`,
  position: `absolute`,
  left: `292px`,
  top: `281px`,
});

const Group8 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  left: `326px`,
  top: `299px`,
});

const Rectangle44 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const To1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `66px`,
  top: `215px`,
});

const AddNewSection = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(50, 181, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `166px`,
  top: `1209px`,
});

const AddAttribute = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(50, 181, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `193px`,
  top: `434px`,
});

const AddPreference = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(50, 181, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `203px`,
  top: `555px`,
});

const Rectangle8 = styled("div")({
  backgroundColor: `rgba(217, 217, 217, 0.86)`,
  width: `281px`,
  height: `70px`,
  position: `absolute`,
  left: `152px`,
  top: `1349px`,
});

const Group6 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `35px`,
  height: `35px`,
  left: `538px`,
  top: `21px`,
});

const Line1 = styled("div")({
  border: `1px solid rgba(0, 0, 0, 1)`,
  width: `49.5px`,
  height: `0px`,
  position: `absolute`,
  left: `7px`,
  top: `17px`,
});

const Line2 = styled("div")({
  border: `1px solid rgba(0, 0, 0, 1)`,
  width: `49.5px`,
  height: `0px`,
  position: `absolute`,
  left: `77px`,
  top: `17px`,
});

const Enter = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `40px`,
  letterSpacing: `0.4px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `191px`,
  height: `60px`,
  position: `absolute`,
  left: `189px`,
  top: `1352px`,
});

const Group9 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `476px`,
  height: `60px`,
  left: `66px`,
  top: `358px`,
});

const Attributes = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `123px`,
  height: `60px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Needed = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `123px`,
  height: `60px`,
  position: `absolute`,
  left: `244px`,
  top: `0px`,
});

const Q1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `19px`,
  height: `60px`,
  position: `absolute`,
  left: `399px`,
  top: `0px`,
});

const Rectangle6 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `46px`,
  height: `24px`,
  position: `absolute`,
  left: `342px`,
  top: `18px`,
});

const Rectangle71 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `46px`,
  height: `24px`,
  position: `absolute`,
  left: `430px`,
  top: `18px`,
});

const Group3 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `71px`,
  height: `24px`,
  left: `131px`,
  top: `18px`,
});

const Rectangle5 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `71px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Preference = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `123px`,
  height: `60px`,
  position: `absolute`,
  left: `59px`,
  top: `486px`,
});

const ShouldBe = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `16px`,
  letterSpacing: `0.16px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `94px`,
  position: `absolute`,
  left: `248px`,
  top: `509px`,
});

const Group31 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `35px`,
  height: `24px`,
  left: `197px`,
  top: `505px`,
});

const Rectangle51 = styled("input")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `35px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Line5 = styled("div")({
  border: `1px solid rgba(0, 0, 0, 1)`,
  width: `518px`,
  height: `0px`,
  position: `absolute`,
  left: `41px`,
  top: `358px`,
});

const Line6 = styled("div")({
  border: `1px solid rgba(0, 0, 0, 1)`,
  width: `518px`,
  height: `0px`,
  position: `absolute`,
  left: `41px`,
  top: `481px`,
});

const Group111 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `130px`,
  height: `24px`,
  left: `613px`,
  top: `500px`,
});

const Rectangle45 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `130px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Group12 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `130px`,
  height: `46px`,
  left: `613px`,
  top: `502px`,
});

const Rectangle46 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `130px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `22px`,
});

const Dvided = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `16px`,
  letterSpacing: `0.16px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `12px`,
  top: `24px`,
});

const Together = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `16px`,
  letterSpacing: `0.16px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `12px`,
  top: `0px`,
});

const Rectangle10 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 0.75)`,
  width: `547px`,
  height: `376px`,
  position: `absolute`,
  left: `19px`,
  top: `683px`,
});

const Rectangle11 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 0.75)`,
  width: `547px`,
  height: `376px`,
  position: `absolute`,
  left: `19px`,
  top: `683px`,
});

const From1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `59px`,
  top: `736px`,
});

const Section1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `36px`,
  letterSpacing: `0.36px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `161px`,
  height: `60px`,
  position: `absolute`,
  left: `21px`,
  top: `677px`,
});

const To2 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `59px`,
  top: `796px`,
});

const Group91 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  left: `196px`,
  top: `756px`,
});

const Rectangle47 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Polygon13 = styled("img")({
  height: `20px`,
  width: `20px`,
  position: `absolute`,
  left: `291px`,
  top: `42px`,
});

const Group10 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  left: `196px`,
  top: `814px`,
});

const Rectangle48 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `276px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Polygon14 = styled("img")({
  height: `20px`,
  width: `20px`,
  position: `absolute`,
  left: `291px`,
  top: `42px`,
});

const Group112 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  left: `196px`,
  top: `880px`,
});

const Rectangle49 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const People1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `56px`,
  top: `862px`,
});

const Q2 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `31px`,
  height: `60px`,
  position: `absolute`,
  left: `285px`,
  top: `862px`,
});

const Group121 = styled("div")({
  display: `flex`,
  position: `absolute`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  left: `319px`,
  top: `880px`,
});

const Rectangle410 = styled("div")({
  backgroundColor: `rgba(255, 255, 255, 1)`,
  border: `1px solid rgba(0, 0, 0, 1)`,
  boxSizing: `border-box`,
  width: `74px`,
  height: `24px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const To3 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(0, 0, 0, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `32px`,
  letterSpacing: `0.32px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `104px`,
  height: `60px`,
  position: `absolute`,
  left: `59px`,
  top: `796px`,
});

const AddAttribute1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(50, 181, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `186px`,
  top: `949px`,
});

const AddPreference1 = styled("div")({
  textAlign: `left`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(50, 181, 255, 1)`,
  fontStyle: `normal`,
  fontFamily: `Alatsi`,
  fontWeight: `400`,
  fontSize: `24px`,
  letterSpacing: `0.24px`,
  textDecoration: `none`,
  textTransform: `none`,
  position: `absolute`,
  left: `177px`,
  top: `1007px`,
});

const Line51 = styled("div")({
  border: `1px solid rgba(0, 0, 0, 1)`,
  width: `518px`,
  height: `0px`,
  position: `absolute`,
  left: `30px`,
  top: `933px`,
});

const Line61 = styled("div")({
  border: `1px solid rgba(0, 0, 0, 1)`,
  width: `518px`,
  height: `0px`,
  position: `absolute`,
  left: `30px`,
  top: `996px`,
});

type Temp = {
  date: string;
  start: string;
  end: string;
  max: number;
  min: number;
};

const TopPage: React.FC = () => {
  const [shiftName, setShiftName] = useState<string>("");
  const [groupUrl, setGroupUrl] = useState<string>("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedStart, setSelectedStart] = useState<string>("");
  const [selectedEnd, setSelectedEnd] = useState<string>("");
  const [selectedMax, setSelectedMax] = useState<number>(0);
  const [selectedMin, setSelectedMin] = useState<number>(0);
  const [temp, setTemp] = useState<Temp[]>([]);
  const [group, setGroup] = useState<Group>({
    name: "",
    group_id: "",
    dates: [],
  });
  const router = useRouter();

  const handleCreate = () => {
    const Id = uuidv4();
    const generatedUserUrl = `${Id}`;
    setGroupUrl(generatedUserUrl);

    const dates = temp.map((t) => {
      return {
        date: t.date,
        from: t.start,
        to: t.end,
        max_people: t.max,
        min_people: t.min,
        attributes: attributes,
        preferences: preferences,
      };
    });

    const postData = {
      name: shiftName,
      group_id: Id,
      dates: dates,
    };

    const post = async () => {
      const response = await axios.post('http://localhost:9000', {
        postData
      });
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
      },
    ]);
    setOpenPopup(false);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", max_people: 0, min_people: 0 }]);
  };

  const addPreference = () => {
    setPreferences([...preferences, { name: "", value: "" }]);
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
          <Dialog open={openPopup} onClose={handlePopupClose} maxWidth="md">
            <DialogTitle>ポップアップタイトル</DialogTitle>
            <DialogContent>
              <DateDetail1>
                <Q20231029>{`2023/10/29`}</Q20231029>
                <Rectangle7></Rectangle7>
                <From>{`from`}</From>
                <Section>{`Section`}</Section>
                <To>{`to`}</To>
                <Group1>
                  <TextField
                    label="My Label"
                    inputProps={{
                      style: {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        border: "1px solid rgba(0, 0, 0, 1)",
                        boxSizing: "border-box",
                        width: "276px",
                        height: "24px",
                        position: "absolute",
                        left: "0px",
                        top: "0px",
                      },
                    }}
                    value={selectedStart}
                    onChange={(e) => setSelectedStart(e.target.value)}
                  />
                  {/* <Rectangle4 value={selectedStart} onChange={(e) => setSelectedStart(e.target.value)}></Rectangle4> */}
                </Group1>
                <Group2>
                  <TextField
                    label="My Label2"
                    inputProps={{
                      style: {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        border: "1px solid rgba(0, 0, 0, 1)",
                        boxSizing: "border-box",
                        width: "276px",
                        height: "24px",
                        position: "absolute",
                        left: "0px",
                        top: "0px",
                      },
                    }}
                    value={selectedEnd}
                    onChange={(e) => setSelectedEnd(e.target.value)}
                  />
                </Group2>
                <Group7>
                  <TextField
                    label="My Label3"
                    inputProps={{
                      style: {
                        backgroundColor: `rgba(255, 255, 255, 1)`,
                        border: `1px solid rgba(0, 0, 0, 1)`,
                        boxSizing: `border-box`,
                        width: `74px`,
                        height: `24px`,
                        position: `absolute`,
                        left: `0px`,
                        top: `0px`,
                      },
                    }}
                    value={selectedMin}
                    onChange={(e) => setSelectedMin(Number(e.target.value))}
                  />
                </Group7>
                <People>{`people`}</People>
                <Q>{`~`}</Q>
                <Group8>
                  <TextField
                    label="My Label4"
                    inputProps={{
                      style: {
                        backgroundColor: `rgba(255, 255, 255, 1)`,
                        border: `1px solid rgba(0, 0, 0, 1)`,
                        boxSizing: `border-box`,
                        width: `74px`,
                        height: `24px`,
                        position: `absolute`,
                        left: `0px`,
                        top: `0px`,
                      },
                    }}
                    value={selectedMax}
                    onChange={(e) => setSelectedMax(Number(e.target.value))}
                  />
                </Group8>
                <To1>{`to`}</To1>
                <AddAttribute>{`Add Attribute`}</AddAttribute>
                <AddPreference>{`Add Preference`}</AddPreference>
                <Group6>
                  <Line1></Line1>
                  <Line2></Line2>
                </Group6>
                <Line5></Line5>
                <Line6></Line6>
              </DateDetail1>
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
              label="シフト表の名前"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar onChange={handleDateChange} />
            <Dialog open={openPopup} onClose={handlePopupClose} maxWidth="md">
              <DialogTitle>ポップアップタイトル</DialogTitle>
              <DialogContent>
                <DateDetail1>
                  <Q20231029>{`2023/10/29`}</Q20231029>
                  <Rectangle7></Rectangle7>
                  <From>{`from`}</From>
                  <Section>{`Section`}</Section>
                  <To>{`to`}</To>
                  <Group1>
                    <Rectangle4></Rectangle4>
                    {/* <Polygon1 src={Polygon1Image} loading='lazy' alt={"Polygon 1"}/> */}
                  </Group1>
                  <Group2>
                    <Rectangle41></Rectangle41>
                    {/* <Polygon11 src={Polygon11Image} loading='lazy' alt={"Polygon 1"}/> */}
                  </Group2>
                  <Group11>
                    <Rectangle42></Rectangle42>
                    {/* <Polygon12 src={Polygon12Image} loading='lazy' alt={"Polygon 1"}/> */}
                  </Group11>
                  <Group7>
                    <Rectangle43></Rectangle43>
                  </Group7>
                  <People>{`people`}</People>
                  <Q>{`~`}</Q>
                  <Group8>
                    <Rectangle44></Rectangle44>
                  </Group8>
                  <To1>{`to`}</To1>
                  <AddNewSection>{`+ add new section`}</AddNewSection>
                  <span
                    style={{
                      textAlign: `left`,
                      whiteSpace: `pre-wrap`,
                      fontSynthesis: `none`,
                      color: `rgba(50, 181, 255, 1)`,
                      fontStyle: `normal`,
                      fontFamily: `Alatsi`,
                      fontWeight: `400`,
                      fontSize: `24px`,
                      letterSpacing: `0.24px`,
                      textDecoration: `none`,
                      textTransform: `none`,
                      position: `absolute`,
                      left: `193px`,
                      top: `434px`,
                    }}
                    onClick={addAttribute}
                  >
                    Add Attribute
                  </span>
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
                          newAttributes[index].max_people = Number(
                            e.target.value
                          );
                          setAttributes(newAttributes);
                        }}
                      />
                      <TextField
                        label="Min People"
                        type="number"
                        value={attr.min_people}
                        onChange={(e) => {
                          const newAttributes = [...attributes];
                          newAttributes[index].min_people = Number(
                            e.target.value
                          );
                          setAttributes(newAttributes);
                        }}
                      />
                    </Box>
                  ))}
                  <AddPreference>{`+ add preference`}</AddPreference>
                  <Rectangle8></Rectangle8>
                  <Group6>
                    <Line1></Line1>
                    <Line2></Line2>
                  </Group6>
                  <Enter>{`Enter`}</Enter>
                  <Group9>
                    <Attributes>{`attributes`}</Attributes>
                    <Needed>{`needed`}</Needed>
                    <Q1>{`~`}</Q1>
                    <Rectangle6></Rectangle6>
                    <Rectangle71></Rectangle71>
                    <Group3>
                      <Rectangle5></Rectangle5>
                    </Group3>
                  </Group9>
                  <Preference>{`preference`}</Preference>
                  <ShouldBe>{`should be `}</ShouldBe>
                  <Group31>
                    <Rectangle51></Rectangle51>
                  </Group31>
                  <Line5></Line5>
                  <Line6></Line6>
                  <Group111>
                    <Rectangle45></Rectangle45>
                  </Group111>
                  <Group12>
                    <Rectangle46></Rectangle46>
                    <Dvided>{`dvided`}</Dvided>
                    <Together>{`together`}</Together>
                  </Group12>
                  <Rectangle10></Rectangle10>
                  <Rectangle11></Rectangle11>
                  <From1>{`from`}</From1>
                  <Section1>{`Section`}</Section1>
                  <To2>{`to`}</To2>
                  <Group91>
                    <Rectangle47></Rectangle47>
                    {/* <Polygon13 src={Polygon13Image} loading='lazy' alt={"Polygon 1"}/> */}
                  </Group91>
                  <Group10>
                    <Rectangle48></Rectangle48>
                    {/* <Polygon14 src={Polygon14Image} loading='lazy' alt={"Polygon 1"}/> */}
                  </Group10>
                  <Group112>
                    <Rectangle49></Rectangle49>
                  </Group112>
                  <People1>{`people`}</People1>
                  <Q2>{`~`}</Q2>
                  <Group121>
                    <Rectangle410></Rectangle410>
                  </Group121>
                  <To3>{`to`}</To3>
                  <AddAttribute1>{`+ add attribute`}</AddAttribute1>
                  <AddPreference1>{`+ add preference`}</AddPreference1>
                  <Line51></Line51>
                  <Line61></Line61>
                </DateDetail1>
              </DialogContent>
              <DialogActions>
                <Button onClick={handlePopupClose} color="primary">
                  閉じる
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

          <Button variant="contained" color="primary" onClick={handlePopupOpen}>
            Open Popup
          </Button>






          {groupUrl && <Typography variant="body1">URL: {groupUrl}</Typography>}
        </Container>
      </Theme>
    </Container>
  );
};

export default TopPage;
