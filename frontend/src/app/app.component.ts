/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from '@angular/core';
import {DialogComponent} from './components/dialog';
import {HelpComponent} from './components/help';
import {UserInfoComponent} from './components/userinfo';
import {LanguageComponent} from './components/language';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {UserService} from './services/user';

/*
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'app',
	styles: [
		require('purecss/build/pure-min.css'),
		require('purecss/build/grids-responsive-min.css'),
		require('./style.scss')
	],
	encapsulation: ViewEncapsulation.None,
	template: require('./template.html'),
})
export class App {
	dialogInput: string;
	panelContent: string = '';
	constructor(translate: TranslateService, userService: UserService) {
		// this language will be used as a fallback when a translation isn't found in the current language
		// translate.setDefaultLang('en');
		userService.loadUser();
	}
	setPanelContent (name: string): void {
		if (this.panelContent === name) {
			this.hidePanel();
		} else {
			this.panelContent = name;
		}
	}
	hidePanel (): void {
		this.panelContent = '';
	}
	sendText(text: string) {
		this.dialogInput = text;
	}
}
