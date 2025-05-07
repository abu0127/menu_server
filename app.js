const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();

const orderTableRouter = require('./router/orderTables');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB()


app.use(cors());
app.use(express.json());

// Routelar
app.use('/api/tables', orderTableRouter);
// app.use('/api/tables', require('./routes/tableRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));