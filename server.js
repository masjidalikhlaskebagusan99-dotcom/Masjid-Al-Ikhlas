// server.js (Backend Proxy untuk Qwen AI)
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Ganti dengan API Key DashScope Anda, atau gunakan environment variable (lebih aman)
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || 'AQ.Ab8RN6I1vRFIOqwyA79ACfHFj9WNFtmBqX1rUPAeOASxDNkcfw';
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

app.use(cors()); // Mengizinkan frontend dari GitHub Pages mengakses backend ini
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            DASHSCOPE_API_URL,
            {
                model: 'qwen-turbo', // Bisa diganti 'qwen-plus' atau 'qwen-max'
                input: {
                    messages: [
                        { role: 'system', content: 'Anda adalah asisten AI yang membantu dan ramah.' },
                        { role: 'user', content: userMessage }
                    ]
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Ekstrak jawaban dari respons DashScope
        const aiReply = response.data.output.text;
        res.json({ reply: aiReply });

    } catch (error) {
        console.error('Error calling DashScope API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Gagal mendapatkan respons dari Qwen AI.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server berjalan di http://localhost:${PORT}`);
});
