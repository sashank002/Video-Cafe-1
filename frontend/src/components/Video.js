import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Video.css";
import Thumbnail from "./Thumbnail";
import getDate from "./GetDate";

const Video = (props) => {

  const _id = props.match.params.videoId;
  const [change, setChange] = useState(false);
  const [specificDate, setSpecificDate] = useState("1");

  const [details, setDetails] = useState({
    videolink: "",
    videoname: "",
    description: "",
  });

  const videoRef = useRef();

  const [dates, setDates] = useState([]);
  const [data2, setData2] = useState([]);


  const options = {
    month: "long",
    year: "numeric",
    day: "numeric",
  };


  // to reload UI on getting video link
  useEffect(() => {
    videoRef.current?.load();
  }, [details]);

  useEffect(() => {

    axios
      .get(`http://localhost:8000/details2?id=${_id}`)
      .then((res) => {
        setDetails({
          videolink: res.data.videoLink,
          videoname: res.data.videoName,
          description: res.data.description,
        });
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get("http://localhost:8000/details2")
      .then((res) => {

        var dataDuplicate = [];
        for (var i = 0; i < res.data.length; i++) {
          dataDuplicate = [
            ...dataDuplicate,
            {
              _id: res.data[i]._id,
              videoname: res.data[i].videoName,
              description: res.data[i].description,
              category: res.data[i].category,
              thumbnailpath: res.data[i].thumbnailPath,
            },
          ];
        }
        setData2(dataDuplicate);
      })
      .catch((e) => {
        console.log(e);
      });

    axios
      .get("http://localhost:8000/date")
      .then((res) => {


        const clone = [];
        res.data.forEach((data) => {

          clone.push(data.uploadDate);
          if (_id === data._id) {
            setSpecificDate(data.uploadDate);
          }
        });

        setDates(clone);
        console.log(dates);
        console.log("specific date", specificDate);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [change]);


  return (
    <div style={{ backgroundColor: " #18181b" }} className="videoCSS">
      <div className="navbar-custom-video">
        <h2 className="cafe-title1"> VIDEO CAFE </h2>
        <Link to={"/home/all"}>
          {" "}
          <button className="upld-btn">HOME</button>
        </Link>
      </div>
      <div className="video-main-div">
        <div className="div--1">
          <video
            ref={videoRef}
            key={_id}
            id="videoPlayer"
            controls
            autoPlay="true"
            className="video-screen"
          >
            <source src={details.videolink} type="video/mp4" />
          </video>
          <div className="detail--div">
            <h4 className="video---title">{details.videoname}</h4>
            <h4 className="video---desc">{details.description}</h4>
            <h4 className="video---desc" style={{ fontSize: "1.4rem" }}>
              Uploaded On{" • "}
              {new Date(specificDate).toLocaleDateString(undefined, options)}
            </h4>
          </div>
        </div>
        <div className="div--2">
          {data2.map((element, index) => {
            if (data2.length === 0) {
            } else {
              return (
                <div className="card-video">
                  <Link
                    to={`/video/${element._id}`}
                    style={{ textDecoration: "none" }}
                    onClick={() => { setChange(!change) }}
                  >
                    <Thumbnail
                      thumbnailpath={element.thumbnailpath}
                      key={index}
                    />
                    <div style={{ marginLeft: "0.5rem" }}>
                      <h4 className="video--title">{element.videoname}</h4>

                      <p className="category">{element.category}</p>
                      <p className="date">{getDate(dates[index])}</p>
                    </div>
                  </Link>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Video;
