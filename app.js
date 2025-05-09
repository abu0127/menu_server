const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();

const orderTableRouter = require('./router/orderTables');
const menuRouter = require('./router/menuRoutes');


connectDB()


app.use(cors());
app.use(express.json());

// Routelar
app.use('/api', orderTableRouter);
app.use('/api/menu', menuRouter);
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));