import React, { useCallback } from 'react';
import { useMachine } from '@xstate/react';

import PatientPicker from './components/PatientPicker';
import Treat from './components/Treat';

import patientMachine from './patientMachine';

function App() {
    const [current, send, service] = useMachine(patientMachine);

    const pickPatient = useCallback(
        patient => {
            send('SELECT', { patient });
        },
        [send]
    );

    if (current.matches('loadingPatients')) {
        return <div>loadingPatients</div>;
    }
    if (current.matches('choose')) {
        return <PatientPicker pickPatient={pickPatient} patients={current.context.patients} />;
    }
    if (current.matches('treat')) {
        return <Treat service={service.children.get('treatment')} />;
    }

    return <div>whoops</div>;
}

export default App;
