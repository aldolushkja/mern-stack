import React, { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
        fetch("/like",{
            method: "PUT",
            headers: {
                "Content-type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem('jwt'),
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(result =>{
            console.log(result)
        })
  }
  const unlikePost = (id) => {
    fetch("/unlike",{
        method: "PUT",
        headers: {
            "Content-type":"application/json",
            "Authorization":"Bearer " + localStorage.getItem('jwt'),
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res => res.json())
    .then(result =>{
        console.log(result)
    })
}
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5> {item.postedBy.name} </h5>
            <div className="card-image">
              <img src={item.photo} style={{height:400}} />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              <i className="material-icons" style={{ marginLeft: 10 }} onClick={() => likePost(item._id)}>
                thumb_up
              </i>
              <i className="material-icons" 
              onClick={() => unlikePost(item._id)}
              style={{marginLeft: 10, }}>
                thumb_down
              </i>
              <h6> {item.likes.length} likes </h6>
              <h5> {item.title} </h5> 
              <p> {item.body} </p>
              <input type="text" placeholder="add a comment" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
