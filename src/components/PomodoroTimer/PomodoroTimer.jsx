/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from "react";
import "./PomodoroTimer.css";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "../../../node_modules/react-circular-progressbar/dist/styles.css";
import {
	PlayButton,
	PauseButton,
	SecondaryButton,
} from "../ui-elements/buttons";
import { Input } from "../ui-elements/forms";

function PomodoroTimer() {
	const sessionMinutesDefault = 25,
		breakMinutesDefault = 5;

	const [sessionMinutesSaved, setSessionMinutesSaved] = useState(
			sessionMinutesDefault
		),
		[breakMinutesSaved, setBreakMinutesSaved] = useState(breakMinutesDefault),
		[sessionMinutes, setSessionMinutes] = useState(sessionMinutesSaved),
		[sessionSeconds, setSessionSeconds] = useState(0),
		[breakMinutes, setBreakMinutes] = useState(breakMinutesSaved),
		[breakSeconds, setBreakSeconds] = useState(0),
		[displayMessage, setDisplayMessage] = useState(""),
		[sessionStatus, setSessionStatus] = useState(false),
		[breakStatus, setBreakStatus] = useState(false),
		[pauseStatus, setPauseStatus] = useState(true),
		[inputsDisabled, setInputsDisabled] = useState(false);

	const totalTime = breakStatus
			? breakMinutesSaved * 60
			: sessionMinutesSaved * 60,
		timeRemaining = totalTime - (+timerMinutes() * 60 + +timerSeconds());

	function setInitialState() {
		clearInterval(interval);
		setSessionMinutes(sessionMinutesSaved);
		setSessionSeconds(0);
		setBreakMinutes(breakMinutesSaved);
		setBreakSeconds(0);
		setDisplayMessage("");
		setSessionStatus(false);
		setBreakStatus(false);
		setPauseStatus(true);
		setInputsDisabled(false);
		timerMinutes();
		timerSeconds();
		resetInputs();
	}

	function resetInputs() {
		document.querySelectorAll(".pd-time-input .input__input").forEach((e) => {
			e.value = e.defaultValue;
		});
	}

	function timerMinutes() {
		let minutes = sessionMinutes;

		if (!sessionStatus && breakStatus) {
			minutes = breakMinutes;
		}

		return minutes < 10 ? `0${minutes}` : minutes;
	}

	function timerSeconds() {
		let seconds = sessionSeconds;

		if (!sessionStatus && breakStatus) {
			seconds = breakSeconds;
		}

		return seconds < 10 ? `0${seconds}` : seconds;
	}

	useEffect(() => startTimer());

	let interval;

	function startTimer() {
		interval = setInterval(() => {
			clearInterval(interval);
			if (!pauseStatus) {
				updateClock();
			}
		}, 1000);
	}

	function updateClock() {
		if (sessionStatus) {
			if (sessionSeconds === 0) {
				if (sessionMinutes !== 0) {
					setSessionSeconds(59);
					setSessionMinutes(sessionMinutes - 1);
				} else {
					setSessionStatus(false);
					setSessionMinutes(sessionMinutesSaved);
					setBreakStatus(true);
					setDisplayMessage("Break:");
				}
			} else {
				setSessionSeconds(sessionSeconds - 1);
			}
		}

		if (breakStatus) {
			if (breakSeconds === 0) {
				if (breakMinutes !== 0) {
					setBreakSeconds(59);
					setBreakMinutes(breakMinutes - 1);
				} else {
					setBreakStatus(false);
					setSessionMinutes(breakMinutesSaved);
					setSessionStatus(true);
					setDisplayMessage("Session:");
				}
			} else {
				setBreakSeconds(breakSeconds - 1);
			}
		}
	}

	function onClickPlay() {
		if (!sessionStatus && !breakStatus) {
			setSessionStatus(true);
			setPauseStatus(false);
			setDisplayMessage("Session:");
			setInputsDisabled(true);
		}
		if ((sessionStatus || breakStatus) && pauseStatus) {
			if (sessionStatus) {
				setDisplayMessage("Session:");
			} else {
				setDisplayMessage("Break:");
			}
			setPauseStatus(false);
		}
	}

	function onClickPause() {
		if ((sessionStatus || breakStatus) && !pauseStatus) {
			clearInterval(interval);
			setPauseStatus(true);
			setDisplayMessage("Pause");
		}
	}

	return (
		<div className="pomodoro-app">
			<div
				className="pomodoro-app__timer"
				onClick={pauseStatus ? onClickPlay : onClickPause}>
				<CircularProgressbarWithChildren
					maxValue={totalTime}
					value={timeRemaining}
					strokeWidth={1}
					background={true}
					styles={buildStyles({
						strokeLinecap: "butt",
						backgroundColor: "var(--ocean-dark)",
						pathColor: "var(--ocean-accent)",
						trailColor: "var(--ocean-disabled)",
					})}>
					{displayMessage && (sessionStatus || breakStatus) && (
						<span className="pomodoro-app__timer-message">{displayMessage}</span>
					)}
					<span className="pomodoro-app__timer-value">
						{timerMinutes()}:{timerSeconds()}
					</span>
					<div className="pomodoro-app__timer-button">
						{pauseStatus ? <PlayButton /> : <PauseButton />}
					</div>
				</CircularProgressbarWithChildren>
			</div>

			<div className="pomodoro-app__settings">
				<span className="pomodoro-app__settings-headline">
					// Set length in minutes
				</span>
				<form className="pomodoro-app__settings-form">
					<Input
						id="pomodoro-session-setting"
						type="number"
						label="Session:"
						defValue={sessionMinutesSaved}
						minValue={1}
						maxValue={60}
						step={1}
						maxLength={2}
						disabled={inputsDisabled}
						onChange={(event) => {
							setSessionMinutes(event.target.value);
							setSessionMinutesSaved(event.target.value);
						}}
					/>
					<Input
						id="pomodoro-break-setting"
						type="number"
						label="Break:"
						defValue={breakMinutesSaved}
						minValue={1}
						maxValue={30}
						step={1}
						maxLength={2}
						disabled={inputsDisabled}
						onChange={(event) => {
							setBreakMinutes(event.target.value);
							setBreakMinutesSaved(event.target.value);
						}}
					/>
				</form>
				<SecondaryButton
					type="reset"
					className="pomodoro-app__settings-button"
					onClick={inputsDisabled ? setInitialState : onClickPlay}
					text={inputsDisabled ? "resetTimer()" : "startTimer()"}
				/>
			</div>
		</div>
	);
}

export default PomodoroTimer;
