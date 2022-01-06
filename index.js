const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// all routes
const usersRoutes = require('./routes/users');
const guildRoutes = require('./routes/guild');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
//app.use(cors());


//all routes adding
app.use('/users', usersRoutes);
app.use('/guild', guildRoutes);


//main route
app.get('/', (req, res) => res.send('Main'));


//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
    console.log('Connected to DB');
});


//listen to port
app.listen(PORT, () => {
    console.log(`Server is listening on port: http://localhost:${PORT}`);
});