import { Machine, assign } from 'xstate';

import { fetchPatient } from './api';

const errorFeedbackStates = {
    initial: 'ok',
    states: {
        ok: {
            on: {
                ERROR: 'errored',
            },
        },
        errored: {},
    },
};

export default Machine({
    id: 'treatment',
    context: {
        patient: undefined,
        currentWord: 0,
        words: undefined,
        notes: undefined,
    },
    initial: 'loading',
    states: {
        loading: {
            invoke: {
                id: 'fetchPatient',
                src: (context, event) => {
                    return fetchPatient(context.patient);
                },
                onDone: {
                    actions: assign({
                        words: (context, event) => event.data.words,
                        notes: (context, event) => event.data.notes,
                    }),
                    target: 'notes',
                },
                onError: {
                    target: 'error',
                },
            },
        },
        notes: {
            on: {
                READY: 'pretreatment',
            },
        },
        pretreatment: {
            on: {
                START: 'treating',
            },
        },
        treating: {
            on: {
                FINISHED: 'finished',
            },
            ...errorFeedbackStates,
        },
        goodbye: {
            on: {
                HANGUP: 'notes',
            },
        },
        error: {},
    },
});
