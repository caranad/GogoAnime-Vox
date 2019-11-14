const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const anime = require('anime-scraper');
const opt = JSON.parse(fs.readFileSync("./options.json", "utf8"));
const AnimeController = require('./controllers/asearch');

const app = express();
const asearch = new AnimeController(anime.Anime);
const PORT = process.env.PORT || 3001

const options = {
    origin: opt.validOrigins,	    
    methods: ['GET','POST', 'PUT', 'DELETE'],	  
    credentials: true
};

app.use(bodyparser.json());
app.use(cors(options));

app.post('/search', (req, res) => {
    const anime_series = req.body.anime.trim();
    const episode_id = parseInt(req.body.episode_id.trim());
    const includeDub = req.body.includeDub;
    const choice = req.body.choice && parseInt(req.body.choice) || undefined;

    asearch.getAnimeDetails(anime_series, episode_id, includeDub, choice).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
})

https.createServer({
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')
}, app).listen(PORT, () => {
    console.log('Started server at', PORT)
})
