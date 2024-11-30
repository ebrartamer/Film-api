 const expressAsyncErrors = require('express-async-errors');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandlerMiddleware = require('./middlewares/errorHandler');


//middleware
app.use(express.json());  //Gönderilen isteklerin bodydeki json formatını okuyabilmek için


dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api', routes);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
