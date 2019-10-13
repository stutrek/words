import React, { useCallback, useState } from 'react';

import styles from './treat.module.css';

export default function Word(props) {
    const { word } = props;

    const [notes, setNotes] = useState(word.notes);
    const onChange = useCallback(
        event => {
            setNotes(event.currentTarget.value);
        },
        [setNotes]
    );

    return (
        <div className={styles.wordContainer}>
            <div className={styles.word}>
                <span>{props.word.word}</span>
            </div>
            <textarea onChange={onChange} value={notes}></textarea>
            <button onClick={props.finished}>Finish</button>
        </div>
    );
}
