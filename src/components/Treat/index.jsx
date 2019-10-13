import React, { useEffect } from 'react';
import { useService } from '@xstate/react';

import Word from './Word';

import styles from './treat.module.css';

export default function Words(props) {
    const [current, send] = useService(props.service);

    useEffect(() => {
        const listener = event => {
            if (event.metaKey && event.key === 'Enter') {
                event.preventDefault();
                if (event.shiftKey) {
                    send('PREVIOUS');
                } else {
                    send('NEXT');
                }
            }
        };
        document.body.addEventListener('keydown', listener);
        return () => {
            document.body.removeEventListener('keydown', listener);
        };
    }, [send]);

    if (current.matches('loading') || current.matches('waiting')) {
        return <div>loading</div>;
    }
    if (current.matches('notes') || current.matches('review')) {
        return (
            <div className={styles.container}>
                <div className={styles.notes}>
                    <h1>Notes</h1>
                    {current.context.notes.map((note, i) => (
                        <div key={i}>
                            <h3>{note.date}</h3>
                            <div>{note.text}</div>
                        </div>
                    ))}
                </div>
                <button className={styles.notesButton} onClick={() => send('NEXT')}>
                    Ready
                </button>
            </div>
        );
    }
    if (current.matches('pretreatment')) {
        return (
            <div className={styles.interstitial}>
                <div>Welcome</div>
                <button onClick={() => send('NEXT')}>Start</button>
            </div>
        );
    }

    if (current.matches('treating')) {
        const word = current.context.words[current.context.currentWord];

        return (
            <div>
                <Word word={word} key={word.word} finished={() => send('FINISHED')} />
            </div>
        );
    }

    if (current.matches('treating')) {
        const word = current.context.words[current.context.currentWord];

        return (
            <div>
                <Word
                    word={word}
                    key={word.word}
                    next={() => send('NEXT')}
                    previous={() => send('PREVIOUS')}
                    finished={() => send('FINISHED')}
                />
            </div>
        );
    }

    if (current.matches('finished')) {
        return (
            <div className={styles.interstitial}>
                <div>Finished</div>
            </div>
        );
    }

    if (current.matches('done')) {
        return <div />;
    }
}
