const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin, (req, res) => {
    Post.find().populate("postedBy", "_id name")
        .then(posts => {
            return res.status(200).json({ posts: posts })
        }).catch(error => {
            console.log(error)
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const {
        title,
        body,
        pic
    } = req.body

    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }

    req.user.password = undefined

    const post = new Post({
        title: title,
        body: body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.status(201).json({ post: result })
    }).catch(error => {
        console.log(error)
    })

})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({
            postedBy: req.user._id
        }).populate("postedBy", "_id name")
        .then((posts) => {
            return res.status(200).json({ posts })
        }).catch(error => {
            console.log(error)
        })
})

module.exports = router;