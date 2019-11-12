const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default class VoiceService {
    constructor(continuous, lang) {
        this.recognition = new SpeechRecognition();
        this.continuous = continuous;
        this.lang = lang;

        this.recognition.onerror = this.handleError;
    }

    startRecognition() {
        this.recognition.start();
    }

    getRecognition() {
        return this.recognition;
    }

    handleError(event) {
        alert("An error occured: ", event.error);
    }
}