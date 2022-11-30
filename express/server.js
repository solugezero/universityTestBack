const postSchema = require("../schemas/post.schema");
const cors = require("cors");
const serverless = require("serverless-http")
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const uuid = require("uuid");
const router = express.Router()

app.use(cors());

// default options
app.use(fileUpload());

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

router.post("/upload", function (req, res) {});

const startDataBase = async () => {
    try {
        await mongoose.connect("mongodb+srv://solugezero:ps2021742@cluster0.uvz94yn.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to mongo");
    } catch (err) {
        console.log(err);
    }
};
startDataBase();

router.get("/all", async (req, res) => {
    const findAll = await postSchema.find().limit(30);
    return res.json(findAll);
});

router.get("/all/:type", async (req, res) => {
    const neededType = req.params.type;
    const findAllType = await postSchema.find({ type: neededType }).limit(30);
    return res.json(findAllType);
});

router.post("/createpost", async (req, res) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    const idFile = uuid.v4();

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.filedata;
    const ext = sampleFile.name.split(".").reverse()[0];
    uploadPath = __dirname + `/uploads/` + `${idFile}.${ext}`;

    // Use the mv() method to place the file somewhere on your server
    await sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        res.send("File uploaded!");
    });
    let newFileData = req.body;
    // console.log(req.body)
    newFileData["fileid"] = idFile;
    const newData = new postSchema(newFileData);
    await newData.save();
});

router.get("/download/:id", async (req, res) => {
    const neededFile = await res.download(`${__dirname}/uploads/${req.params.id}`);
    return neededFile;
});

app.use('/', router)
module.exports = app;
module.exports.handler = serverless(app)