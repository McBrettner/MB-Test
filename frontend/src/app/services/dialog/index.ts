/* beautify ignore:start */
import {Injectable} from '@angular/core';
import {Message, Author} from './../../components/message';
import {LanguageService} from './../language';
import {Http, Response} from '@angular/http';
import {Feedback} from './../../components/feedback';
/* beautify ignore:end */

enum WSState {
	CONNECTING, OPEN, CLOSING, CLOSED
}

/**
@Injectable()
export class DialogService {
	ws_url: string = 'wss://asset-advisor.w3ibm.mybluemix.net/ws/converse';
	socket: WebSocket;
	client_id: number;
	conversation_id: number;
	constructor () {
		this.setupSockets();
	}
	setupSockets (): void {
		this.socket = new WebSocket(this.ws_url);
	}
	initConversation (): void {
		if (this.socket.readyState === WSState.OPEN) {
			this.sendMessage(new Message());
		} else {
			this.socket.onopen = () => this.sendMessage(new Message());
		}
	};
	sendMessage (message: Message): void {
		message.client_id = this.client_id;
		message.conversation_id = this.conversation_id;
		this.socket.send(JSON.stringify(message));
	};
	onMessage (callback: (e: Message) => any): void {
		let _this = this;
		this.socket.onmessage = function (e: MessageEvent) {
			let message: Message = new Message();
			if (e.data) {
				let data = JSON.parse(e.data);
				if (data.data) {
					message.data = data.data;
				}
				if (data.type) {
					message.type = data.type;
				}
				if (data.client_id) {
					message.client_id = data.client_id;
					_this.setClientId(data.client_id);
				}
				if (data.conversation_id) {
					message.conversation_id = data.conversation_id;
					_this.setConversationId(data.conversation_id);
				}
				message.author = Author.WATSON;
				callback(message);
			}
		};
	};
	setClientId (n: number) {
		this.client_id = n;
	};
	setConversationId (n: number) {
		this.conversation_id = n;
	};
}
*/

@Injectable()
export class HTTPDialogService {
	url: string = '/api/converse';
	feedbackUrl: string = '/api/feedback';
	messageCallback: (e: Message) => any;
	context: {};
	constructor (private http: Http, private languageService: LanguageService) {
	}
	initConversation (): void {
		this.sendMessage(new Message());
	};
	sendMessage (message: Message): void {
		message.context = this.context;
		message.lang = this.languageService.getLanguage();
		this.http.post(this.url, JSON.stringify(message))
		.map(this.extractData.bind(this))
		.subscribe(
			this.messageCallback,
			error => console.log(error)
		);
	};
	sendFeedback (feedback: Feedback) {
		this.http.post(this.feedbackUrl, JSON.stringify(feedback))
		.subscribe(
			undefined,
			error => console.log(error)
		);
	}
	onMessage (callback: (e: Message) => any): void {
		this.messageCallback = callback;
	};
	setContext (c: {}) {
		this.context = c;
	};
	getContext () {
		return this.context;
	};
	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		let body = res.json();
		let data = body || { };
		let message: Message = new Message();
		if (data.data) {
			if (data.data) {
				message.data = data.data;
			}
			if (data.type) {
				message.type = data.type;
			}
			if (data.context) {
				message.context = data.context;
				this.setContext(data.context);
			}
			message.author = Author.WATSON;
			return message;
		}

	}
}
