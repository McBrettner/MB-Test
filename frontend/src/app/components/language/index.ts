/* beautify ignore:start */
import {Component} from '@angular/core';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {LanguageService, Language} from './../../services/language';
/* beautify ignore:end */

@Component({
	selector: 'languageSelector',
	providers: [LanguageService],
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class LanguageComponent {
	constructor(private languageService: LanguageService) {
	}
	setLanguage(lang: string) {
		this.languageService.setLanguage(lang);
	}
	getAvailableLanguages(): string[] {
		return this.languageService.getAvailableLanguages();
	}
}
