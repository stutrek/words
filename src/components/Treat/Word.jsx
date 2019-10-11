import React, { useCallback } from 'react';

export default function Word(props) {
    const { word, setNotes } = props;

    const onKeyPress = useCallback(
        event => {
            if (event.altKey === false) {
                event.preventDefault();
            }
            setNotes(word, event.currentTarget.value);
        },
        [setNotes, word]
    );

    return (
        <div>
            <div>{props.word.word}</div>
            <textarea onKeyPress={onKeyPress}>{props.notes}</textarea>
        </div>
    );
}
