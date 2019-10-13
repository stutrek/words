// export const fetchPatients = async () => {
//     const result = await fetch('/api/patients');
//     if (result.ok) {
//         return await result.json();
//     }
//     throw result;
// };

// export const fetchPatient = async name => {
//     const result = await fetch(`/api/patient/${name}`);
//     if (result.ok) {
//         return await result.json();
//     }
//     throw result;
// };

export const fetchPatients = async () => {
    return Promise.resolve(['vera', 'chuck', 'dave']);
};

export const fetchPatient = async name => {
    return Promise.resolve({
        words: [
            {
                word: 'rural',
                notes: 'impossible',
                good: 1,
                bad: 12,
            },
            {
                word: 'juror',
                notes: 'can be done',
                good: 10,
                bad: 2,
            },
        ],
        notes: [
            {
                date: '2019-09-20',
                text: 'some text from that day.',
            },
        ],
    });
};

export const tallyAccuracy = async (patient, word, goodOrBad) => {
    await fetch(`/api/tally`, {
        method: 'PUT',
        body: JSON.stringify({
            patient,
            word,
            goodOrBad,
        }),
    });
};
