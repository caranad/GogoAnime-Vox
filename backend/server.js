const express = require('express');
const bodyparser = require('body-parser');
const anime = require('anime-scraper');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const utils = require('./utils/utils');
const opt = JSON.parse(fs.readFileSync("./options.json", "utf8"));

const app = express();
const asearch = anime.Anime;
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
    let choice = req.body.choice && parseInt(req.body.choice) || undefined;

    if (!choice) {
        asearch.search(anime_series).then((results) => {
            if (!includeDub) {
                results = utils.removeDub(results);
            }

            // More than one result for that same anime title 
            if (results.length > 1) {
                res.send({ results: results })
            }
            // Only one result
            else if (results.length == 1) {
                results[0].toAnime().then((anime) => {
                    anime.episodes[episode_id - 1].fetch().then((episode) => {
                        res.send({ episode: utils.filterEpisodes(episode.videoLinks) });
                    }).catch(() => {
                        res.send({ err: "Episode not found" });
                    })
                });
            }
            // Result not found
            else {
                res.send({ err: "Anime not found" });
            }
        }).catch(() => {
            res.send({ err: "Anime not found" })
        })
    }
    else {
        asearch.search(anime_series).then((results) => {
            if (!includeDub) {
                results = utils.removeDub(results);
            }

            results[choice - 1].toAnime().then((anime) => {
                // It's a movie most likely. Pick it up
                if (anime.episodes.length === 1) {
                    anime.episodes[0].fetch().then((episode) => {
                        res.send({ episode: utils.filterEpisodes(episode.videoLinks) });
                    })
                }
                // It's an anime series. Scope it out first...
                else {
                    if (anime.episodes[episode_id - 1]) {
                        anime.episodes[episode_id - 1].fetch().then((episode) => {
                            res.send({ episode: utils.filterEpisodes(episode.videoLinks) });
                        })
                    }
                    else {
                        res.send({ err: "Episode not found" });
                    }
                }
            }).catch(() => {
                res.send({ err: "Episode not found" })
            });
        }).catch(() => {
            res.send({ err: "Anime not found"})
        })
    }
})

https.createServer({
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.cert')
}, app).listen(PORT, () => {
    console.log('Started server at', PORT)
})
