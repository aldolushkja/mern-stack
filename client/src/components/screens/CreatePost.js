import React, {useEffect, useState} from 'react'
import M from "materialize-css";
import {useHistory} from 'react-router-dom'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        // call backend and save into Mongo DB
        if (url) {
            fetch("/createpost", {
                method: "post", headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                }, body: JSON.stringify({
                    title: title,
                    body: body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    // console.log(data)
                    if (data.error) {
                        M.toast({html: data.error, classes: "#c62828 red darken-3"})
                    } else {
                        M.toast({html: "created post successfully", classes: "#388e3c green darken-2"})
                        history.push("/")
                    }
                }).catch(err => {
                console.log(err)
            })
        }
    }, [url])

    const postDetails = () => {
        //Upload to cloudinary
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dwj4ndm6c")
        fetch("https://api.cloudinary.com/v1_1/dwj4ndm6c/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url)
            }).catch(err => {
            console.log(err)
        })
    }


    return (
        <div className="card input-field"
             style={{margin: "13px auto", maxWidth: "500px", padding: "20px", textAlign: "center"}}>
            <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <input type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)}/>

            <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue darken-1" name="action"
                    onClick={() => postDetails()}>Submit post
            </button>


        </div>
    )
}

export default CreatePost