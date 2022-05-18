const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectionURL = "mongodb+srv://ku5h:ku5h@cluster0.4walf.mongodb.net/VideoCafeDB?retryWrites=true&w=majority";

// model
var VideoDetails = require("./models/videoDetails");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));     // this let's the front end (react) code to access the files that are on back end (node) server (not from the database) 


mongoose.connect(connectionURL, { useNewUrlParser: true });
var conn = mongoose.connection;
conn.on('connected', function () {
    console.log('database is connected successfully');
});
conn.on('disconnected', function () {
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));



app.post("/submit", async (req, res) => {

    var video_details = new VideoDetails({ videoLink: req.query.videolink, videoName: req.query.videoname, description: req.query.videodescription, category: req.query.videocategory, uploadDate: new Date(), thumbnailPath: 'https://i.ytimg.com/vi/AwhyFo5N0cg/maxresdefault.jpg' });
    video_details.save(function (err, videodetail) {
        if (err) return console.error(err);
        console.log(videodetail.videoname + " saved to video-details collection.");
    });
});



app.get("/details2", async (req, res) => {


    if (req.query.id) {

        await VideoDetails.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
            .then((data) => {
                res.status(201).send(data);
            })
            .catch((err) => {
                console.log(err)
            })
    }
    else {
        if (!req.query.category) {
            await VideoDetails.find({})
                .then((arr) => {
                    res.status(201).send(arr);
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {

            await VideoDetails.find({ category: req.query.category })
                .then((arr) => {
                    res.status(201).send(arr);
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

});



app.get("/date", async (req, res) => {

    await VideoDetails.find({})
        .then((result) => {
            // console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});



app.listen(8000, function () {
    console.log("server is running");
});