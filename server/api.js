require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.API_KEY;
const baseurl = process.env.BASE_URL;
console.log('API Key:',apiKey);
console.log('Base URL:' ,baseUrl)

async function fetchData () {
    try{
        const response = await fetch(`${baseUrl}/data`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) {
            throw new Error (`HTTP error Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error){
        console.error('Fetch error:', error.message);
    }
}
fetchData();