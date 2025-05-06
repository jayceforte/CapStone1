

const baseUrl = "http://localhost:4000";



const API_BASE = import.meta.env.VITE_API_BASE;
const apiKey = import.meta.env.VITE_API_KEY;


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
export async function apiFetch(path, options = {}) {
    const res = await fetch("http://localhost:4000/api/items", {
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "API Error");
    }
  
    return res.json();
  }
fetchData();