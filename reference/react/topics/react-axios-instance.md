# Axios instance

React topic · Exam Wiki

```js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
});

export async function getHotels() {
    const { data } = await api.get('/hotels');
    return data;
}
```

Axios throws on 4xx and 5xx, so a `catch` catches both network errors and error responses. `fetch` does not throw on 404, which is a common source of confusion.
