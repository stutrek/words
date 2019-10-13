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

const treatmentMachine = Machine({
    id: 'treatment',
    context: {
        patient: undefined,
        currentWord: 0,
        words: undefined,
        notes: undefined,
    },
    initial: 'waiting',
    states: {
        waiting: {
            on: {
                LOAD: 'loading',
            },
        },
        loading: {
            entry: assign((context, event) => ({
                patient: event.patient,
            })),
            invoke: {
                id: 'fetchPatient',
                src: (context, event) => {
                    return fetchPatient(event.patient);
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
                NEXT: 'pretreatment',
            },
        },
        pretreatment: {
            on: {
                NEXT: 'treating',
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
                NEXT: 'review',
            },
        },
        review: {
            on: {
                NEXT: 'done',
                ERROR: 'error',
            },
        },
        done: {
            type: 'final',
        },
        error: {
            type: 'final',
        },
    },
});

export default treatmentMachine;
