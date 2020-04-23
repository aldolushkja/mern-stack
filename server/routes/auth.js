const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')


router.post("/signup", (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please fill all fields" })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "user already exists with that email" })
        }

        bcrypt.hash(password, 16).then(
            (hashedpassword) => {
                const user = new User({
                    email: email,
                    name: name,
                    password: hashedpassword
                })

                user.save().then((user) => {
                    res.status(201).json({ message: "saved successfully" })
                }).catch(err => {
                    console.log("Error saving user", err)
                });
            }
        ).catch(err => {
            console.log("Error encrypting current password", err)
        })

    }).catch(err => {
        console.log("Error routing on /signup endpoint", err)
    })
})

module.exports = router;