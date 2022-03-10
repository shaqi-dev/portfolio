import React from "react";
import "./styles.css";

function PrimaryButton(props) {
	const { type, className, onClick, disabled, text } = props;

	return (
		<button
			type={type}
			className={`primary-button ${className}`}
			onClick={onClick}
			disabled={disabled}>
			{text}
		</button>
	);
}

export default PrimaryButton;
