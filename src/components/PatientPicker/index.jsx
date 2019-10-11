import React, { useCallback } from 'react';
import styles from './picker.module.css';

export default function PatientPicker(props) {
    const { pickPatient } = props;

    const onChange = useCallback(
        event => {
            pickPatient(event.target.value);
        },
        [pickPatient]
    );

    return (
        <div className={styles.container}>
            <select onChange={onChange}>
                <option>Select a patient</option>
                {props.patients.map(patient => (
                    <option value={patient} key={patient}>
                        {patient}
                    </option>
                ))}
            </select>
        </div>
    );
}
