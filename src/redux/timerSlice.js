import { createSlice } from "@reduxjs/toolkit";
import {
  POMODORO,
  LONG_BREAK,
  SHORT_BREAK,
  SLOW_TICKING,
  DIGITAL_SOUND,
} from "../constants";

const initialState = {
  mode: POMODORO,
  round: 1,
  longBreakInterval: 4,
  pomodoroCount: 0,
  shortBreakCount: 0,
  longBreakCount: 0,
  alarmSound: DIGITAL_SOUND,
  alarmVolume: 80,
  alarmRepeat: 1,
  tickingSound: SLOW_TICKING,
  tickingVolume: 80,
  modes: {
    [POMODORO]: {
      id: POMODORO,
      label: "Pomodoro",
      time: 25,
    },
    [SHORT_BREAK]: {
      id: SHORT_BREAK,
      label: "Short Break",
      time: 5,
    },
    [LONG_BREAK]: {
      id: LONG_BREAK,
      label: "Long Break",
      time: 15,
    },
  },
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    incrementRound: (state) => {
      state.round += 1;
    },
    updateModeTime: (state, action) => {
      const { mode, time } = action.payload;
      state.modes[mode].time = time;
    },
    setLongBreakInterval: (state, action) => {
      state.longBreakInterval = action.payload;
    },
    setPomodoroCount: (state) => {
      state.pomodoroCount += 1;
    },
    setShortBreakCount: (state) => {
      state.shortBreakCount += 1;
    },
    setLongBreakCount: (state) => {
      state.longBreakCount += 1;
    },
    setAlarmSound: (state, action) => {
      state.alarmSound = action.payload;
    },
    setAlarmVolume: (state, action) => {
      state.alarmVolume = action.payload;
    },
    setAlarmRepeat: (state, action) => {
      state.alarmRepeat = action.payload;
    },
    setTickingSound: (state, action) => {
      state.tickingSound = action.payload;
    },
    setTickingVolume: (state, action) => {
      state.tickingVolume = action.payload;
    },
  },
});

export const {
  setMode,
  incrementRound,
  updateModeTime,
  setLongBreakInterval,
  setAlarmSound,
  setAlarmVolume,
  setAlarmRepeat,
  setTickingSound,
  setTickingVolume,
  setPomodoroCount,
  setShortBreakCount,
  setLongBreakCount,
} = timerSlice.actions;

export default timerSlice.reducer;
