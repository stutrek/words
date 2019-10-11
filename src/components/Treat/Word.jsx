import React, { useEffect, useCallback, useState } from 'react';

import styles from './treat.module.css';

export default function Word(props) {
    const { word, next, previous } = props;

    const [notes, setNotes] = useState(word.notes);

    useEffect(() => {
        const listener = event => {
            if (event.metaKey === true) {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    previous();
                }
                if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    next();
                }
            }
        };
        document.body.addEventListener('keydown', listener);
        return () => {
            document.body.removeEventListener('keydown', listener);
        };
    });

    const onChange = useCallback(
        event => {
            console.log(event);
            if (event.altKey === false) {
                setNotes(event.currentTarget.value);
                event.preventDefault();
                return;
            }
        },
        [setNotes]
    );

    return (
        <div className={styles.container}>
            <div className={styles.word}>
                <span>{props.word.word}</span>
            </div>
            <textarea onChange={onChange} value={notes}></textarea>
        </div>
    );
}
