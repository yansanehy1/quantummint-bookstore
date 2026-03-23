const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: process.env.SERVICE_NAME || 'unknown' });
});

app.listen(port, () => {
    console.log(`Service listening on port ${port}`);
});
