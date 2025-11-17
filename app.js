const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>DevOps CI/CD</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .container {
                        text-align: center;
                        color: white;
                    }
                    h1 { font-size: 3em; margin: 0; }
                    p { font-size: 1.5em; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 DevOps CI/CD Pipeline</h1>
                    <p>Successfully Deployed!</p>
                    <p>Version: 2.1.0</p>
                </div>
            </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
