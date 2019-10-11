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
                NEXT: {
                    actions: assign({
                        currentWord: context =>
                            Math.min(context.words.length - 1, context.currentWord + 1),
                    }),
                },
                PREVIOUS: {
                    actions: assign({
                        currentWord: context => Math.max(0, context.currentWord - 1),
                    }),
                },
            },
            ...errorFeedbackStates,
        },
        finished: {
            on: {
                HANGUP: 'notes',
            },
        },
        error: {},
    },
});
