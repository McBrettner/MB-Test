/* beautify ignore:start */
import {Injectable} from '@angular/core';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
/* beautify ignore:end */

export enum Language {
	cs,
	en
}

@Injectable()
export class LanguageService {
	defaultLang : string = 'en';
	constructor(private translate: TranslateService) {
		this.translate.use(this.getLanguage());
	}
	getLanguage(): string {
		let languages = Object.keys(Language).map(k => Language[k]).filter(v => typeof v === "string");
		var userLang;
		if (this.storageAvailable('localStorage')) {
			userLang = localStorage.getItem('lang');
			userLang = (new RegExp('(' + languages.join('|') + ')', 'gi')).test(userLang) ? userLang : this.defaultLang;
		}
		if (!userLang) {
			userLang = navigator.language.split('-')[0]; // use navigator lang if available
			userLang = (new RegExp('(' + languages.join('|') + ')', 'gi')).test(userLang) ? userLang : this.defaultLang;
		}
		return Language[Language[userLang]];
	}
	setLanguage(lang: string) {
		if (this.storageAvailable('localStorage')) {
			localStorage.setItem('lang', lang);
		}
		window.location.reload();
	}
	getAvailableLanguages(): string[] {
		var langs: string[] = [];
		for (var n in Language) {
			if (typeof Language[n] === 'number') {
				langs.push(n);
			}
		}
		return langs;
	}
	storageAvailable(type) {
		try {
			var storage: any = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		} catch(e) {
			return false;
		}
	}
}
