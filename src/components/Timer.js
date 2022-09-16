/* eslint-disable no-restricted-globals */
import { useCallback, useEffect } from "react";
import clsx from "clsx";
import Icon from "./Icon";
import Progress from "./Progress";
import classes from "./Timer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setPomodoroCount, setShortBreakCount, setLongBreakCount } from "../redux/timerSlice";
import {
  CONFIRM,
  LONG_BREAK,
  POMODORO,
  SHORT_BREAK,
  START,
  STOP
} from "../constants";
import { updateFavicon, updateTitle, formatTime } from "../helpers";
import useCountdown from "../useCountdown";
import { player } from "../util";

const buttonSound = player({
  asset: "sounds/button-press.wav",
  volume: 0.5,
});

const tickingAudio = player({
  loop: true,
});

const alarmAudio = player({});

const SecondaryButton = ({ children, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        classes.secondaryButton,
        active && classes.secondaryActive
      )}
    >
      {children}
    </button>
  );
};

const PrimaryButton = ({ active, onClick, color }) => (
  <button
    onClick={onClick}
    className={clsx(
      classes.primaryButton,
      active && classes.primaryActive,
      color
    )}
  >
    {active ? STOP : START}
  </button>
);

const NextButton = ({ onClick, className }) => (
  <button onClick={onClick} className={clsx(classes.nextButton, className)}>
    <Icon name="skip_next" size={48} />
  </button>
);

export default function Timer() {
  const dispatch = useDispatch();
  const {
    mode,
    modes,
    tickingSound,
    tickingVolume,
    alarmSound,
    alarmVolume,
    longBreakInterval,
    pomodoroCount,
    shortBreakCount,
    longBreakCount,
  } = useSelector((state) => state.timer);

  const { ticking, start, stop, reset, timeLeft, progress } = useCountdown({
    minutes: modes[mode].time,
    onStart: () => {
      updateFavicon(mode);
      if (mode === POMODORO) {
        tickingAudio.play();
      }
    },
    onStop: () => {
      updateFavicon();
      if (mode === POMODORO) {
        tickingAudio.stop();
      }
    },
    onComplete: () => {
      next();
      if (mode === POMODORO) {
        tickingAudio.stop();
      }
      alarmAudio.play();
    },
  });

  useEffect(() => {
    updateTitle(timeLeft, mode);
  }, [mode, timeLeft]);

  const jumpTo = useCallback(
    (id) => {
      reset();
      updateFavicon(id);
      dispatch(setMode(id));
    },
    [dispatch, reset]
  );

  useEffect(() => {
    tickingAudio.stop();
    tickingAudio.setAudio(tickingSound);
    if (ticking && mode === POMODORO) {
      tickingAudio.play();
    }
  }, [mode, ticking, tickingSound]);

  useEffect(() => {
    alarmAudio.setAudio(alarmSound);
  }, [alarmSound]);

  useEffect(() => {
    tickingAudio.setVolume(tickingVolume);
  }, [tickingVolume]);

  useEffect(() => {
    alarmAudio.setVolume(alarmVolume);
  }, [alarmVolume]);

  const next = useCallback(() => {
    switch (mode) {
      case LONG_BREAK:
        jumpTo(POMODORO);
        dispatch(setLongBreakCount());
        start();
        break;
      case SHORT_BREAK:
        jumpTo(POMODORO);
        dispatch(setShortBreakCount());
        start();
        break;
      default:
        if (pomodoroCount % longBreakInterval === 0 && pomodoroCount !== 0) {
          jumpTo(LONG_BREAK);
        } else {
          jumpTo(SHORT_BREAK);
        }
        dispatch(setPomodoroCount());
        start();
        break;
    }
  }, [dispatch, jumpTo, mode, start]);

  const confirmAction = useCallback(
    (cb) => {
      let allowed = true;
      if (ticking) {
        stop();
        allowed = confirm(CONFIRM);
        start();
      }

      if (allowed) {
        cb();
      }
    },
    [start, stop, ticking]
  );

  const confirmNext = useCallback(() => {
    confirmAction(next);
  }, [confirmAction, next]);

  const confirmJump = useCallback(
    (id) => {
      confirmAction(() => jumpTo(id));
    },
    [confirmAction, jumpTo]
  );

  const toggleTimer = useCallback(() => {
    buttonSound.play();
    if (ticking) {
      stop();
    } else {
      start();
    }
  }, [start, stop, ticking]);

  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <ul>
            {Object.values(modes).map(({ id, label }) => (
              <SecondaryButton
                key={id}
                active={id === mode}
                id={id}
                onClick={() => confirmJump(id)}
              >
                {label}
              </SecondaryButton>
            ))}
          </ul>
          <div className={classes.time}>{formatTime(timeLeft)}</div>
          <div className={classes.actionButtons}>
            <div className={classes.left} />
            <PrimaryButton
              active={ticking}
              onClick={toggleTimer}
              color={classes[mode]}
            />
            <div className={classes.right}>
              <NextButton
                className={ticking && classes.showNext}
                onClick={confirmNext}
              />
            </div>
          </div>
        </div>
        <div className={classes.counter}>
          <div className={classes.eachCount}>
            <b>{pomodoroCount}</b>
            <p>Pomodoro Count</p>
          </div>
          <div className={classes.eachCount}>
            <b>{shortBreakCount}</b>
            <p> Short Break Count</p>
          </div>
          <div className={classes.eachCount}>
            <b>{longBreakCount}</b>
            <p>Long Break Count</p>
          </div>
        </div>
      </div>
    </div>
  );
}
