const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
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
        photo: pic,
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
        .then((mypost) => {
            return res.status(200).json({ mypost })
        }).catch(error => {
            console.log(error)
        })
})

router.put("/like", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})

router.put("/unlike", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})

router.put("/comment", requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            comments: comment
        }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    error: err
                })
            } else {
                res.json(result)
            }
        })
})


router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({
                    error: err
                })
            } else {
                if (post.postedBy._id.toString() === req.user._id.toString()) {
                    post.remove()
                        .then(result => {
                            res.json(result)
                        }).catch(err => {
                            console.log(err)
                        })
                }
            }
        })
})


router.delete("/deletecomment/:postId/comment/:commentId", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        req.params.postId, { $pull: { "comments": { _id: req.params.commentId } } },
        { safe: true, upsert: true },
        function (err, result) {
            if (err) { console.log(err) }
            else {
                console.log(`=========`)
                console.log(result)
                console.log(`=========`)

                return res.json(result)
            }

        })
})

module.exports = router;