import React from "react";
import "./styles.css";

function PlayButton(props) {
	return (
		<button className={"icon-btn"} {...props}>
			<div className="svg-icon clock-control-icon play"></div>
		</button>
	);
}

export default PlayButton;
