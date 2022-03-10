import React from "react";
import './pdTimeInput.css';

function PdTimeInput({label, minValue, maxValue, maxLength, defValue, disabled, onChange}) {
    
    return (
        <div className='pd-time-input'>
                <span className={disabled ? "input__label disabled" : "input__label"}>{label}</span>
                <input 
                    type="number" 
                    min={minValue} max={maxValue} step="1"
                    maxLength={maxLength}  
                    defaultValue={defValue}
                    className='input__input'
                    onChange={(event) => {
                        const input = event.target
                        input.value = input.value.slice(0, input.maxLength)
                        if (input.value > maxValue) {
                            input.value = maxValue
                        }
                        if (input.value < minValue) {
                            input.value = minValue
                        }
                        onChange(event)
                    }}
                    disabled={disabled}
                />
        </div>
    )
}

export default PdTimeInput;