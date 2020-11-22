const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {
    MONGOURI
} = require('./keys')

// =======================
// Mongo DB Connection 
// =======================

mongoose.connect(MONGOURI || 'localhost/instagram_clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo DB')
})

mongoose.connection.on('error', (err) => {
    console.log('Unable to connect to Mongo DB', err)
})

// =======================
// App Routes and Mongo DB Models
// =======================

require("./models/user")
require("./models/post")

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

// =======================
// App Server init
// =======================

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})