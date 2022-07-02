const fetch = require('node-fetch');

const API_KEY = 'braintechsolution_default_secret';
// const BRAINTECHSOLUTION_URL = 'http://localhost:3000/api/v1/meeting';
// const BRAINTECHSOLUTION_URL = 'https://p2p.braintechsolution.com/api/v1/meeting';
// const BRAINTECHSOLUTION_URL = 'https://braintechsolution.up.railway.app/api/v1/meeting';
const BRAINTECHSOLUTION_URL = 'https://braintechsolution.herokuapp.com/api/v1/meeting';

function getResponse() {
    return fetch(BRAINTECHSOLUTION_URL, {
        method: 'POST',
        headers: {
            authorization: API_KEY,
            'Content-Type': 'application/json',
        },
    });
}

getResponse().then(async (res) => {
    console.log('Status code:', res.status);
    const data = await res.json();
    console.log('meeting:', data.meeting);
});
