import React from "react";
import './pdTimeInput.css';

function PdTimeInput({label, minValue, maxValue, maxLength, defValue, onChange}) {

    
    return (
        <>
            <span className="pd-settings__input-label">{label}</span>
            <input 
                type="number" 
                min={minValue} max={maxValue} step="1"
                maxLength={maxLength}  
                defaultValue={defValue}
                className='pd-settings__input'
                onChange={(event) => onChange(event)}
                onInput={(event) => {
                    const input = event.target
                    input.value = input.value.slice(0, input.maxLength)
                    if (input.value > maxValue) {
                        input.value = maxValue
                    }
                    if (input.value < minValue) {
                        input.value = minValue
                    }
                }}
            />
        </>
    )
}

export default PdTimeInput;