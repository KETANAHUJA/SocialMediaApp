import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
        console.log(result);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "ketanahuja");
      fetch("https://api.cloudinary.com/v1_1/ketanahuja/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid gray",
        }}
      >
        <div>
          <img
            style={{ width: "180px", height: "180px", borderRadius: "90px" }}
            src={state ? state.pic : "loading.."}
          />
          <div className="file-field" style={{ margin: "10px 0px 5px -50px" }}>
            <div className="btn #64b5f6 blue darken-1">
              <span>Upload pic</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>

            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4> {state ? state.name : "Loading..."}</h4>
          <h5> {state ? state.email : "Loading..."}</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics.length} posts</h6>

            <h6>{state ? state.followers.length : 0} followers</h6>
            <h6>{state ? state.following.length : 0} following</h6>
          </div>
        </div>
      </div>
      <div className="gallary">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              alt={item.title}
              src={item.photo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
