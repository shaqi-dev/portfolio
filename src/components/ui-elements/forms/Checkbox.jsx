import React from "react";
import { useState } from "react";
import "./Checkbox.css";

function Checkbox({ text, onClick }) {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<div className="checkbox">
			<div
				className={`checkbox__field ${
					isChecked ? "checkbox__field_active" : ""
				}`}
				onClick={() => {
					setIsChecked(!isChecked);
					onClick();
				}}
			/>
			<span
				className={`checkbox__label ${
					isChecked ? "checkbox__label_active" : ""
				}`}>
				{text}
			</span>
		</div>
	);
}

export default Checkbox;
