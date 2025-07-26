const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(bodyParser.json());

//MongoDb connection

mongoose.connect('mongodb://localhost:27017/todoapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongo Db connected'))
.catch(err => console.log(err)); 

//Routes
app.use('/api/tasks',require('./routes/tasks'));

app.listen(PORT,() => console.log(`server is listening on http://localhost:${PORT}`));