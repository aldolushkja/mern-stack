import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../App";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text
      })
    }).then(res => res.json())
      .then((result) => {
        console.log(result);

        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData);
      }).catch(err => {
        console.log(err)
      })
  }


  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    }).then(res => res.json())
      .then((result) => {
        console.log(result);

        const newData = data.filter((item) => {
          return item._id != result._id
        })
        setData(newData);
      }).catch(err => {
        console.log(err)
      })
  }

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    }).then(res => res.json())
      .then((result) => {
        console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData);
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 > {item.postedBy.name}
              {
                item.postedBy._id == state._id &&
                <i className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => deletePost(item._id)}>
                  delete
              </i>
              }
            </h5>
            <div className="card-image">
              <img src={item.photo} style={{ height: 400 }} />
            </div>
            <div className="card-content">

              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{ marginLeft: 10 }}
                  onClick={() => unlikePost(item._id)}
                >
                  thumb_down
                </i>
              ) : (
                  <i
                    className="material-icons"
                    onClick={() => likePost(item._id)}
                    style={{ marginLeft: 10 }}
                  >
                    thumb_up
                  </i>
                )}
              <h6> {item.likes.length} likes </h6>
              <h5> {item.title} </h5>
              <p> {item.body} </p>
              {item.comments.map(record => {
                return (
                  <h6 key={record._id} id={record._id}>
                    <span style={{ fontStyle: "bold", fontWeight: "500", marginRight: "10" }}>{record.postedBy.name}</span>: {record.text}

                    {
                      record.postedBy._id == state._id &&
                      <i className="material-icons"
                        style={{ float: "right" }}
                        onClick={() => deleteComment(item._id, record._id)}>
                        delete
              </i>
                    }

                  </h6>
                )
              })}
              <form onSubmit={(e) => {
                e.preventDefault()
                makeComment(e.target[0].value, item._id);
              }}>
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
