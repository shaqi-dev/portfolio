import React from "react";
import "./Input.css";

function Input({
	id,
	type,
	label,
    defValue,
	minValue,
	maxValue,
    step,
	maxLength,
	disabled,
	onChange,
}) {
	function handleChange(event) {
		const input = event.target;
		if (input.maxLength) {
			input.value = input.value.slice(0, input.maxLength)
		}
		if (input.value > maxValue) {
			input.value = maxValue;
		}
		if (input.value < minValue) {
			input.value = minValue;
		}
		onChange(event);
	}

	return (
		<div className="input">
			{label ? (
				<label
					htmlFor ={id}
					className={
						!disabled
							? "input__label"
							: "input__label input__label_disabled"
					}>
					{label}
				</label>
			) : null}
			<input
				id={id}
				type={type}
				min={minValue}
				max={maxValue}
				step={step}
				maxLength={maxLength}
				defaultValue={defValue}
				className="input__field"
				onChange={(event) => handleChange(event)}
				disabled={disabled}
			/>
		</div>
	);
}

export default Input;
