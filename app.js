const expressAsyncErrors = require('express-async-errors');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const path = require('path');
//middleware
app.use(express.json());

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dotenv.config();
const BASE_PORT = process.env.PORT || 4000;

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api', routes);
app.use(errorHandlerMiddleware);

// Uploads klasörünü statik olarak sun
app.use('/uploads', express.static('uploads'));

// Recursive port bulma fonksiyonu
const findAvailablePort = (port) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port)
            .on('listening', () => {
                server.close(() => resolve(port));
            })
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(findAvailablePort(port + 1));
                } else {
                    reject(err);
                }
            });
    });
};

// Server'ı başlat
findAvailablePort(BASE_PORT)
    .then(port => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Server error:', err);
        process.exit(1);
    });
