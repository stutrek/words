import React, { useCallback } from 'react';

export default function PatientPicker(props) {
    const { pickPatient } = props;

    const onChange = useCallback(
        event => {
            pickPatient(event.target.value);
        },
        [pickPatient]
    );

    return (
        <div>
            <select onChange={onChange}>
                {props.patients.map(kid => (
                    <option value={kid} key={kid}>
                        {kid}
                    </option>
                ))}
            </select>
        </div>
    );
}
