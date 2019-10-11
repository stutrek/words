import { Machine, assign } from 'xstate';

import treatmentMachine from './treatmentMachine';

import { fetchPatients, fetchPatient } from './api';

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
                    actions: assign({
                        patient: (context, event) => event.patient,
                    }),
                },
                RELOAD: 'loadingPatients',
            },
        },

        treat: {
            on: {
                FINISHED: 'select',
            },
        },
        error: {
            on: {
                START_OVER: 'loading',
            },
        },
    },
});
