import xmlbuilder from 'xmlbuilder';
let context;    // Audio context
let buf;        // Audio buffer
let source;     // Audio buffer

export default class TextToSpeech {
    constructor(
        accessToken,
        baseUrl = "https://westus2.tts-frontend.speech.microsoft.com/synthesize/internal") {
        this.baseUrl = baseUrl;
        this.accessToken = accessToken;
    }

    buildSSML(text, voice="Microsoft Server Speech Text to Speech Voice (en-US, EvaNeural)", version = '1.0', locale = 'en-us') {
        let xml_body = xmlbuilder.create('speak')
            .att('version', version)
            .att('xml:lang', locale)
            .ele('voice')
            .att('xml:lang', locale)
            .att('name', voice)
            .txt(text)
            .end();
        return xml_body.toString();
    }

    async speak(text, inheritedFunctions) {
        let ssml = this.buildSSML(text);
        let headers = new Headers();
        headers.append('Authorization', "Bearer " + this.accessToken);
        headers.append('cache-control', 'no-cache');
        headers.append('X-Microsoft-OutputFormat', 'riff-24khz-16bit-mono-pcm');
        headers.append('Content-Type', 'application/ssml+xml');
        let options = {
            method: 'POST',
            body: ssml,
            headers
        }
        fetch(this.baseUrl, options).then((res) => {
            return res.blob();
        }).then((b) => {
            var url = URL.createObjectURL(b)
            var audioCtx = new window.AudioContext();
            source = audioCtx.createBufferSource();
            var xhr = new XMLHttpRequest();
            var url = URL.createObjectURL(b);

            // stream blob to AudioContext player
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function (r) {
                audioCtx.decodeAudioData(
                    xhr.response,
                    function (buffer) {
                        source.buffer = buffer;
                        source.connect(audioCtx.destination);
                        source.loop = false;
                        source.onended = function () {
                            inheritedFunctions();
                        }

                    });
                source.start(0);
            });
            xhr.send();
        }).catch((err) => {
            console.log(err)
        })

    }

    async speakToBlobURL(voice, text, audioOutputHeader = 'riff-24khz-16bit-mono-pcm') {
        // speakToBlobURL is a convenience function that returns a usable url 
        // instead of a blob.
        let blob = await this.speak(voice, text, audioOutputHeader)
        return URL.createObjectURL(blob);
    }
}