import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 100, // Number of virtual users (simulated clients)
    duration: '30s', // Duration of the test
};


export default function () {

    const url = 'http://localhost:3000/auth/login';
    for (let i = 0; i < 1000; i++) {
        const payload = JSON.stringify({
            username: 'aaa',
            password: 'bbbb',
        });

        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = http.post(url, payload, params);
        console.log(`Request ${i + 1} - Status: ${response.status}, Duration: ${response.timings.duration} ms`);
        // Add a sleep to simulate user think time (adjust as needed)
        sleep(0.5); // Sleep for 0.5 seconds between requests
    }


}