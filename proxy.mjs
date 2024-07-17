// proxy.mjs
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.get('/fetch', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        res.send(text);
    } catch (error) {
        console.error('Error fetching the URL:', error);
        res.status(500).send('Failed to fetch the URL');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
