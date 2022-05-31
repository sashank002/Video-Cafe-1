import React, { useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import logo from "../images/logo-2.png";
import uploadImage from "../images/upload.png";
import "../css/Upload.css";
import { Moralis } from 'moralis';
import { useMoralisCloudFunction } from "react-moralis";
import Cookies from "js-cookie";

import bgVideo2 from "../images/bgVideo2.mp4";

import { create } from "ipfs-http-client";

import { Buffer } from 'buffer';
import { useHistory } from "react-router-dom"

const client = create('https://ipfs.infura.io:5001/api/v0');


const Upload = () => {

  const Catogory = [
    { value: 0, label: "News" },
    { value: 0, label: "Comedy" },
    { value: 0, label: "Movies" },
    { value: 0, label: "Gaming" },
    { value: 0, label: "Sports" },
    { value: 0, label: "Podcasts" },
    { value: 0, label: "Music" },
  ];
  const history = useHistory();
  const token = Cookies.get("token");

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles[0]) {
      alert("please choose video file only");
    } else {
      setVideoFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "video/mp4",
  });

  const [videoFile, setVideoFile] = useState();
  const [bufferFile, setBufferFile] = useState(null);
  const [details, setDetails] = useState({
    name: "",
    description: "",
    category: "News",
  });

  const handleName = (e) => {
    setDetails({ ...details, name: e.target.value });
  };

  const handleDescription = (e) => {
    setDetails({ ...details, description: e.target.value });
  };

  const handleCategories = (e) => {
    setDetails({ ...details, category: e.currentTarget.value });
  };

  const handleSubmit = async () => {

    var file;
    if (!videoFile) {
      alert("please choose video file");
    }
    else {

      //  basic IPFS CODE

      const reader = new window.FileReader();
      reader.readAsArrayBuffer(videoFile);

      reader.onloadend = async () => {
        console.log("Buffer data: ", Buffer(reader.result));
        // setBufferFile(Buffer(reader.result))
        try {
          const created = await client.add(Buffer(reader.result));
          const url = `https://ipfs.infura.io/ipfs/${created.path}`;
          console.log("video uploaded at : ", url)

          axios
            .post(
              `http://localhost:8000/submit?videolink=${url}&videoname=${details.name}&videodescription=${details.description}&videocategory=${details.category}&token=${token}`
            )
            .then(function (response) {
              console.log(response);
              alert("video uploaded");
              history.push("/home/all");
            })
            .catch(function (error) {
              console.log(error);
            });

        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };

  return (

    <div className="upload-container">
      <video autoPlay loop muted className="bgVideo">
        <source src={bgVideo2} type="video/mp4" />
      </video>

      <div className="u-container">
        <div className="left-div">
          <div className="left-logo-name-div">
            <img src={logo} />
            <p>VIDEO CAFE</p>
          </div>

        </div>

        <div className="right-div">
          <div className="right-form-div">
            <p className="right-form-div-title">Upload your video here!!</p>

            <div className="right-form-upload-icon-div" {...getRootProps()}>
              <input {...getInputProps()} />
              <img src={uploadImage} />
            </div>
            {videoFile ? (
              <p className="selectedFileName">"{videoFile.name}" selected</p>
            ) : null}

            <form className="right-form-name-desc-div">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "1.5rem",
                }}
              >
                <label className="name">Name: </label>
                <input
                  className="nameInput"
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="video name here"
                  onChange={handleName}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "1.5rem",
                }}
              >
                <label className="name">Description: </label>
                <textarea
                  className="desInput"
                  rows="3"
                  cols="40"
                  name="description"
                  placeholder="description here.."
                  onChange={handleDescription}
                ></textarea>
              </div>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <label className="name">Category: </label>
                <select className="categoryInput" onChange={handleCategories}>
                  {Catogory.map((item, index) => (
                    <option
                      key={index}
                      className="categorySelect"
                      value={item.label}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <div className="btn-div">
              <Link to="/home/all">
                <button className="upld-btn-reverse">Home</button>
              </Link>

              <button className="upld-btn-simple" onClick={handleSubmit}>
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="div-2"></div>
    </div>
  );
};

export default Upload;
