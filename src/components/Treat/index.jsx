import React from 'react';
import { useMachine } from '@xstate/react';
import treatmentMachine from '../../treatmentMachine';

import Word from './Word';

export default function Words(props) {
    const [machine, send] = useMachine(treatmentMachine, { context: { patient: props.patient } });

    if (machine.matches('loading')) {
        return <div>loading</div>;
    }
    if (machine.matches('notes')) {
        return (
            <div>
                {machine.context.notes.map((note, i) => (
                    <div key={i}>
                        <div>{note.date}</div>
                        <div>{note.text}</div>
                    </div>
                ))}
                <button onClick={() => send('READY')}>Ready</button>
            </div>
        );
    }
    if (machine.matches('pretreatment')) {
        return (
            <div>
                <div>Welcome</div>
                <button onClick={() => send('START')}>Start</button>
            </div>
        );
    }
    return (
        <div>
            {machine.context.words.map(word => (
                <Word word={word} key={word.word} />
            ))}
        </div>
    );
}
