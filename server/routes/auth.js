const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')

router.get("/health", (req, res) => {
    res.json({ status: "OK" })
})


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

router.post("/signin", (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }

    User.findOne({ email: email })
        .then((receivedUser) => {
            if (!receivedUser) {
                return res.status(422).json({ error: "invalid email or password" })
            }
            bcrypt.compare(password, receivedUser.password)
                .then((doMatch) => {
                    if (doMatch) {
                        // return res.json({ message: "successful login! You welcome" })
                        const token = jwt.sign({ id: receivedUser._id }, JWT_SECRET)
                        const {_id, name, email} = receivedUser
                        return res.json({ token: token, user: {
                            _id, name, email
                            } })
                    } else {
                        return res.status(422).json({ error: "Invalid email or password" })
                    }
                }).catch(err => {
                    console.log("Error comparing passowrd", err)
                })
        })
})

module.exports = router;