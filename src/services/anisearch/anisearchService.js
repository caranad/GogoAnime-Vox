import data from '../../../options.json';
import axios from 'axios';

export default class AniSearchService {
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
}