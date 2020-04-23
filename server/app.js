const express = require('express')
const app = express()
const PORT = 5000

// Middleware

app.get("/", (req, res) => {
    res.send('Hello world from Node JS');
})

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})