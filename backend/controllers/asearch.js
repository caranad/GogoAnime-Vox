const utils = require('../utils/utils');

class AnimeSearchController {

    constructor(anime) {
        this.asearch = anime;
    }

    getSearchResults(anime_series, episode_id, includeDub, resolve, reject) {
        this.asearch.search(anime_series).then((results) => {
            if (!includeDub) {
                results = utils.removeDub(results);
            }

            // More than one result for that same anime title 
            if (results.length > 1) {
                resolve({ results: results })
            }
            // Only one result
            else if (results.length == 1) {
                results[0].toAnime().then((anime) => {
                    anime.episodes[episode_id - 1].fetch().then((episode) => {
                        resolve({ results: utils.filterEpisodes(episode.videoLinks) });
                    }).catch(() => {
                        reject({ err: "Episode not found" });
                    })
                });
            }
            // Result not found
            else {
                reject({ err: "Anime not found" });
            }
        }).catch(() => {
            reject({ err: "Anime not found" })
        })
    }

    getAnimeEpisode(anime_series, episode_id, includeDub, choice, resolve, reject) {
        this.asearch.search(anime_series).then((results) => {
            if (!includeDub) {
                results = utils.removeDub(results);
            }

            results[choice - 1].toAnime().then((anime) => {
                // It's a movie most likely. Pick it up
                if (anime.episodes.length === 1) {
                    anime.episodes[0].fetch().then((episode) => {
                        resolve({ results: utils.filterEpisodes(episode.videoLinks) });
                    })
                }
                // It's an anime series. Scope it out first...
                else {
                    if (anime.episodes[episode_id - 1]) {
                        anime.episodes[episode_id - 1].fetch().then((episode) => {
                            resolve({ results: utils.filterEpisodes(episode.videoLinks) });
                        })
                    }
                    else {
                        reject({ err: "Episode not found" });
                    }
                }
            }).catch(() => {
                reject({ err: "Episode not found" })
            });
        }).catch(() => {
            reject({ err: "Anime not found"})
        })
    }

    getAnimeDetails(anime_series, episode_id, includeDub, choice) {
        if (!choice) {
            return new Promise((resolve, reject) => {
                this.getSearchResults(anime_series, episode_id, includeDub, resolve, reject)
            });
        }
        else {
            return new Promise((resolve, reject) => {
                this.getAnimeEpisode(anime_series, episode_id, includeDub, choice, resolve, reject);
            })
        }
    }
}

module.exports = AnimeSearchController;