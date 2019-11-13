import data from '../../../options.json';
import axios from 'axios';

export default class AniSearchService {
    anime_name = '';
    episode_id = '';
    includeDub = true;
    anime_option = -1;

    getAnimeFromDB(anime, episode_id, includeDub) {
        return axios.post(`https://${data.url}:${data.port}/search`, {
            anime: anime,
            episode_id: episode_id,
            includeDub: includeDub
        })
    }

    getAnimeEpisode(anime, episode_id, choice, includeDub) {
        return axios.post(`https://${data.url}:${data.port}/search`, {
            anime: anime,
            episode_id: episode_id,
            choice: choice,
            includeDub: includeDub
        })
    }

    setAnimeName(anime_name) {
        this.anime_name = anime_name;
    }

    setEpisodeID(episode_id) {
        this.episode_id = episode_id;
    }

    setIncludeDub(includeDub) {
        this.includeDub = includeDub;
    }

    setAnimeOption(option) {
        this.anime_option = option;
    }

    getAnimeName() {
        return this.anime_name;
    }

    getEpisodeID() {
        return this.episode_id;
    }

    getIncludeDub() {
        return this.includeDub;
    }

    getAnimeOption() {
        return this.anime_option;
    }
}