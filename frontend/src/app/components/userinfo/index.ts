/* beautify ignore:start */
import {Component, OnInit} from '@angular/core';
import {UserService, User} from './../../services/user';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {LanguageService} from './../../services/language';
/* beautify ignore:end */

@Component({
	selector: 'userinfo',
	providers: [LanguageService],
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class UserInfoComponent implements OnInit {
	user: User = null;
	constructor(private userService: UserService, private languageService: LanguageService) {
	}
	ngOnInit() {
		this.userService.getUser((user: User) => this.user = user);
	}
	isArray(x: any) {
		return Array.isArray(x);
	}
	printDate(date: Date) {
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		switch (this.languageService.getLanguage()) {
			case 'cs':
				return date.toLocaleDateString('cs-CS', options);
			case 'en':
				return date.toLocaleDateString('en-US', options);
			default:
				return date.toLocaleDateString('en-US', options);
		}
	}
}
