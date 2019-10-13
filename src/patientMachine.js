import { Machine, assign, send } from 'xstate';

import treatmentMachine from './treatmentMachine';

import { fetchPatients } from './api';

export default Machine({
    id: 'patient',
    initial: 'loadingPatients',
    context: {
        patients: undefined,
    },
    states: {
        loadingPatients: {
            invoke: {
                id: 'fetchPatients',
                src: fetchPatients,
                onDone: {
                    target: 'choose',
                    actions: assign({
                        patients: (context, event) => event.data,
                    }),
                },
                onError: {
                    target: 'error',
                },
            },
        },
        choose: {
            on: {
                SELECT: {
                    target: 'treat',
                },
                RELOAD: 'loadingPatients',
            },
        },

        treat: {
            invoke: {
                id: 'treatment',
                src: treatmentMachine,
                onDone: 'choose',
            },
            entry: send(
                (context, event) => ({
                    type: 'LOAD',
                    patient: event.patient,
                }),
                { to: 'treatment' }
            ),
        },

        error: {
            on: {
                START_OVER: 'loading',
            },
        },
    },
});
