/* beautify ignore:start */
import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {LanguageService} from './../language';
/* beautify ignore:end */

export class Phone {
	name: string;
	exchangeDate: Date;
}
export class User {
	UID: string;
	name: string;
	emails: string[];
	phones: Phone[];
}


@Injectable()
export class UserService {
	private user: User = null;
	constructor (private http: Http, private languageService: LanguageService) {
	}
	loadUser () {
		let params: URLSearchParams = new URLSearchParams();
		params.set('lang', this.languageService.getLanguage());
		this.http.get('/api/user', {search: params})
		.map(this.extractUserInfo.bind(this))
		.subscribe(
			(user: User) => this.user = user,
			error => console.log(error)
		);
	}
	getUser (callback: (user: User) => void): void {
		if (this.user) {
			callback(this.user);
		} else {
			let params: URLSearchParams = new URLSearchParams();
			params.set('lang', this.languageService.getLanguage());
			this.http.get('/api/user', {search: params})
			.map(this.extractUserInfo.bind(this))
			.subscribe(
				callback,
				error => console.log(error)
			);
		}
	}
	private extractUserInfo (res: Response): User {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		let data = res.json();
		if (data) {
			let user = new User();
			user.UID = data.uid;
			user.emails = data.mails;
			user.name = data.name;
			for (let phone of data.mobiles) {
				phone.exchangeDate = new Date(phone.exchangeDate);
			}
			user.phones = data.mobiles;
			this.user = user;
			return user;
		} else {
			return null;
		}
	}
}
