const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
require('dotenv').config();

const orderTableRouter = require('./router/orderTables');

connectDB()

const app = express();
app.use(cors());
app.use(express.json());

// Routelar
app.use('/api/tables', orderTableRouter);
// app.use('/api/tables', require('./routes/tableRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));