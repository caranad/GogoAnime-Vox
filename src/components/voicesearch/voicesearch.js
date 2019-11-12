/* eslint-disable */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faSearch, faArrowLeft, faQuestion } from '@fortawesome/free-solid-svg-icons'

import VoiceService from '../../services/voice/voiceService';
import AniSearchService from '../../services/anisearch/anisearchService';
import ResultContainer from '../resultcontainer/rescontainer'

import './voicesearch.css'

export default class VoiceSearch extends Component {
    state = {
        searchQuery: '',
        placeholder: 'Search for anime',
        progress: 'SEARCH',
        animes: []
    } 

    animeSearchService = new AniSearchService();
    voiceService = new VoiceService(true, 'en-US');
    validRegex = new RegExp(/(GET)(JAPANESE )?[A-Z0-9 ]+(EPISODE )\d+/);
    anime_name = '';
    episode_id = '';
    choice = -1;
    includeDub = true;
    episodeOption = -1;

    constructor() { 
        super();
    }

    search() {
        document.querySelector(".voicesearch section button").style.backgroundColor = "red";
        this.voiceService.startRecognition();
        this.voiceService.getRecognition().onresult = (event) => {
            if (event.results[0].isFinal) {
                this.setResult(event.results[0][0].transcript.toUpperCase());
            }
        };

        this.voiceService.getRecognition().onend = () => {
            document.querySelector(".voicesearch section button").style.backgroundColor = "#2a2ab0";
            this.searchDB();
        }
    }

    extractQueryInfo = (query, includeDub) => {
        let anime_name = '';

        if (includeDub) {
            anime_name = query.slice("GET ".length, query.indexOf("EPISODE"));
        }
        else {
            anime_name = query.slice("GET JAPANESE ".length, query.indexOf("EPISODE"));
        }

        const episode_id = query.slice(query.indexOf("EPISODE") + "EPISODE".length);
        this.anime_name = anime_name;
        this.episode_id = episode_id;
    }

    getAnimeFromDB = (query, includeDub) => {
        this.extractQueryInfo(query, includeDub);

        this.setState({
            progress: "LOADING"
        })
        this.includeDub = includeDub;
        this.props.passError('');

        this.animeSearchService.getAnimeFromDB(
            this.anime_name, this.episode_id, includeDub
        ).then((response) => {
            if (response.data.results) {
                this.setState({
                    progress: 'PICK',
                    placeholder: 'Pick an option #',
                    searchQuery: '',
                    animes: response.data.results
                })
                this.props.passError('');
            }
            else if (response.data.err) {
                this.setState({
                    progress: 'SEARCH',
                })
                this.props.passError(response.data.err);
            }
        })
    }

    getAnimeEpisode = (query) => {
        this.setState({
            progress: "LOADING"
        });
        this.choice = query;
        this.props.passError('');

        this.animeSearchService.getAnimeEpisode(
            this.anime_name, this.episode_id, this.choice, this.includeDub
        ).then((response) => {
            if (response.data.err) {
                this.setState({
                    searchQuery: '',
                    progress: 'PICK'
                })
                this.props.passError(response.data.err);
            }
            else {
                this.props.passData(response.data.episode);
                this.setState({
                    progress: 'SEARCH',
                    searchQuery: '',
                    placeholder: 'Search for anime',
                })
            }
        })
    }

    openHelp() {
        alert("Click on the microphone button and say something like, 'Get Sword Art Online Episode 1' to begin your search.")
    }

    searchDB() {
        if (this.state.progress === 'SEARCH') {
            const query = this.state.searchQuery.toUpperCase();

            if (!this.validRegex.test(query)) {
                this.props.passError("Format for searching is GET <optional: JAPANESE> <anime> EPISODE <epNum>")
            }
            else if (query.indexOf("JAPANESE") !== -1) {
                this.getAnimeFromDB(query, false);
            }
            else {
                this.getAnimeFromDB(query, true);
            }
        }
        else if (this.state.progress === 'PICK') {
            const query = this.episodeOption;
            const epID = parseInt(query);

            if (isNaN(epID) || epID < 0 || epID > this.state.animes.length) {
                this.props.passError("Please pick a number from 1 to " + this.state.animes.length);
            }
            else {
                this.getAnimeEpisode(this.episodeOption);
            }
        }
    }

    setResult = (q) => {
        if (this.state.progress === 'SEARCH') {
            this.setState({
                searchQuery: q
            })
        }
        else if (this.state.progress === 'PICK') {
            if (this.state.animes[parseInt(q) - 1]) {
                this.setState({
                    searchQuery: this.state.animes[parseInt(q) - 1].name,
                })   
                this.episodeOption = q;
            }
            else {
                this.setState({
                    searchQuery: "",
                })   
                this.episodeOption = -1;
            }
        }
    }

    reset = () => {
        this.setState({
            searchQuery: '',
            placeholder: 'Search for anime',
            progress: 'SEARCH',
            animes: []
        });

        this.anime_name = '',
        this.episode_id = '',
        this.choice = -1

        this.props.passError('');
    }

    render() {
        return (
            <div className="voicesearch">
                <section className="voice_input_container">
                    {
                        this.state.progress === 'PICK' ? (
                            <ResultContainer animes={ this.state.animes }/>
                        ) : null
                    }
                    <div className="voice_input">
                        <FontAwesomeIcon 
                            icon={ faSearch } 
                            color="black" 
                            size="2x"/>
                        <input type="text" 
                            onChange={ this.setResult }
                            value={ this.state.searchQuery } 
                            placeholder={ this.state.placeholder }
                            readOnly/>
                    </div>
                </section>
                { 
                    this.state.progress !== 'LOADING' ? 
                    (
                        <section className="voicesearch_button_containers">
                            <button onClick={ () => this.search() }>
                                <FontAwesomeIcon 
                                    icon={ faMicrophone } 
                                    color="white" 
                                    size="2x"/>
                            </button>
                            <button onClick = { () => this.openHelp() }>
                                <FontAwesomeIcon 
                                    icon={ faQuestion } 
                                    color="white" 
                                    size="2x"/>
                            </button>
                            <button onClick = { () => this.reset() }>
                                <FontAwesomeIcon 
                                    icon={ faArrowLeft } 
                                    color="white" 
                                    size="2x"/>
                            </button>
                            {/* <button onClick = { () => { 
                                this.setResult("get konosuba episode 1");
                                this.searchDB();
                            } }>
                                TEST SAMPLE
                            </button>
                            <button onClick = { () => { 
                                this.setResult("1");
                                this.searchDB();
                            } }>
                                TEST CHOICE SAMPLE
                            </button> */}
                        </section>
                    ) : (
                        <section className="loading">
                            Awaiting response...
                        </section>
                    )
                }
            </div>
        )
    }
}