import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import createConn, { serverStatus } from "./src/database";
import UrlModel from "./src/models/urlModel";

  
const app = express();

app.use(express.static("public"));

// Connect to MongoDB
createConn();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get("/health", (req, res) => {
  res.send("Working!!");
});
app.use('/db/health', (req, res) => {
  res.send(serverStatus());
});

app.post('/generate-short-url', async (req, res) => {
  try {
    const url = new UrlModel({ fullUrl: req.body.fullUrl });
    await url.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.get('/list', async (req, res) => {
  try {
    const url = await UrlModel.find();
    res.send(url);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
})

app.get('/:shortUrl', async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;
    const url = await UrlModel.findOne({ shortUrl });
    if (!url) {
      return res.status(500).send('URL not found');
    }
    url.clicks++;
    url.save();
    res.redirect(url.fullUrl);
  } catch (error) {
    res.status(500).send('internal server error');
  }
});

const port = 3000;
app.listen(process.env.PORT || port, async () => {
  try {
    console.log(
      `The application is listening on port ${process.env.PORT || port}`
    );
    console.log("Node Environment-", process.env.NODE_ENV);
  } catch (error) {
    console.log("error ==>", error);
    process.exit(0);
  }
});