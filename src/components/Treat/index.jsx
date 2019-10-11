import React from 'react';
import { useMachine } from '@xstate/react';
import treatmentMachine from '../../treatmentMachine';

import Word from './Word';

import styles from './treat.module.css';

export default function Words(props) {
    const [machine, send] = useMachine(treatmentMachine, { context: { patient: props.patient } });

    if (machine.matches('loading')) {
        return <div>loading</div>;
    }
    if (machine.matches('notes')) {
        return (
            <div className={styles.container}>
                <div className={styles.notes}>
                    <h1>Notes</h1>
                    {machine.context.notes.map((note, i) => (
                        <div key={i}>
                            <h3>{note.date}</h3>
                            <div>{note.text}</div>
                        </div>
                    ))}
                </div>
                <button className={styles.notesButton} onClick={() => send('READY')}>
                    Ready
                </button>
            </div>
        );
    }
    if (machine.matches('pretreatment')) {
        return (
            <div className={styles.interstitial}>
                <div>Welcome</div>
                <button onClick={() => send('START')}>Start</button>
            </div>
        );
    }
    const word = machine.context.words[machine.context.currentWord];
    return (
        <div>
            <Word
                word={word}
                key={word.word}
                next={() => send('NEXT')}
                previous={() => send('PREVIOUS')}
            />
        </div>
    );
}
