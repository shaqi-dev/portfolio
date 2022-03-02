import React, { useState } from "react";
import "./pdClock.css";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "../../../node_modules/react-circular-progressbar/dist/styles.css";
import { PlayButton, PauseButton } from '../ui-elements/buttons';
import PdTimeInput from "../ui-elements/inputs/pdTimeInput";


function PdClock() {
	const percentage = 66;
	
	const sessionDefValue = 25,
		  breakDefValue = 5;

	const [ sessionLength, setSessionLength ] = useState(sessionDefValue);
	const [ breakLength, setBreakLength ] = useState(breakDefValue)

	return (
		<div className="container">
			<div className="pomodoro-app">
				<div className="pd-timer">
					<div className="pd-timer__circle">
						<CircularProgressbarWithChildren
							value={percentage}
							strokeWidth={0.7}
							styles={buildStyles({
								strokeLinecap: "butt",
								pathColor: "#fff",
								trailColor: "rgba(255, 255, 255, 0.3)",
							})}>
							<span className="pd-timer__value">{sessionLength}:00</span>
						</CircularProgressbarWithChildren>
					</div>
					<div className="pd-timer__control">
						<PlayButton />
						<PauseButton />
					</div>
				</div>
				<div className="pd-settings">
					<span className="pd-settings__headline">Settings</span>
					<PdTimeInput 
						label={'Session Length'}
						minValue={5}
						maxValue={60}
						maxLength={2}
						defValue={sessionDefValue}
						onChange={(event) => setSessionLength(event.target.value)}/>
					<PdTimeInput 
						label={'Break Length'}
						minValue={1}
						maxValue={30}
						maxLength={2}
						defValue={breakDefValue}
						onChange={(event) => setBreakLength(event.target.value)}/>
				</div>
			</div>

		</div>
	);
}

export default PdClock;
