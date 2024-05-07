import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 100, // Number of virtual users (simulated clients)
    duration: '30s', // Duration of the test
};

export default function () {
    for (let i = 0; i < 1000; i++) {
        // Make a GET request to the backend service
        const response = http.get('http://localhost:3000');

        // Log the response status and duration
        console.log(`Request ${i + 1} - Status: ${response.status}, Duration: ${response.timings.duration} ms`);

        // Add a sleep to simulate user think time (adjust as needed)
        sleep(0.5); // Sleep for 0.5 seconds between requests
    }
}
