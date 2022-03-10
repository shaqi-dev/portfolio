import React from "react";
import "./styles.css";

function SecondaryButton(props) {
	const { type, className, onClick, disabled, text } = props;

	return (
		<button
			type={type}
			className={`secondary-button ${className}`}
			onClick={onClick}
			disabled={disabled}>
			{text}
		</button>
	);
}

export default SecondaryButton;
