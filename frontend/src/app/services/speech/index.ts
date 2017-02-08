/* beautify ignore:start */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import * as WatsonSpeech from 'assets/js/watson-speech';
import 'process/browser.js';
import * as Resampler from './resampler.js';
import * as recorder from './recorder.js';

let Recorder = recorder(Resampler);

let Voices = {
	allison : 'en-US_AllisonVoice',
	lisa : 'en-US_LisaVoice',
	kate : 'en-GB_KateVoice',
	michael : 'en-US_MichaelVoice'
};

@Injectable()
export class SpeechService {
	s2tToken: string;
	t2sToken: string;
	audio: any;
	constructor (private http: Http) {
	};
	talk(text: string): void {
		if (this.t2sToken) {
			if (this.audio) {
				this.audio.pause();
			}
			this.audio = WatsonSpeech.TextToSpeech.synthesize({
				token: this.t2sToken,
				text: text,
				voice: Voices.allison
			});
		} else {
			setTimeout(() => this.talk(text), 300);
		}
	};
	listen(): void {
		console.log('start recording');
		Recorder.recordStart();
	}
	stopListen(callback: (e: string) => any): void {
		console.log('stop recording');
		let blob = Recorder.recordStop();
		let searchEngineURL = 'https://35.157.108.217:7891/speech-api/v2/recognize?output=txt&lang=de_DE&vadthr=0.01';
		let headers = new Headers({ 'Content-Type': 'audio/l16; rate=16000;' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(searchEngineURL, blob, options)
		.map((res: Response): string => {
			if (res.status < 200 || res.status >= 300) {
				throw new Error('Bad response status: ' + res.status);
			}
			return res.text();
		})
		.subscribe(
			callback,
			error => console.log(error)
		);
	};
	audioSwitch() {
		if (this.audio) {
			if (this.audio.paused) {
				this.audio.play();
			} else {
				this.audio.pause();
			}
		}
	}
	private getSpeechToTextToken (): void {
		this.http.post('/api/speech/s2tToken', '')
		.map(this.extractToken)
		.subscribe(
			(token: string) => this.s2tToken = token,
			error => console.log(error)
		);

	};
	private getTextToSpeechToken (): void {
		this.http.post('/api/speech/t2sToken', '')
		.map(this.extractToken)
		.subscribe(
			(token: string) => this.t2sToken = token,
			error => console.log(error)
		);
	};
	private extractToken (res: Response): string {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		return res.text();
	}
}
