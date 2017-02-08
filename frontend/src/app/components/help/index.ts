/* beautify ignore:start */
import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {InputComponent} from './../input';
import {HelpService} from './../../services/help';
/* beautify ignore:end */

@Component({
	selector: 'help',
	providers: [HelpService],
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class HelpComponent implements OnInit{
	helpList: Array<Object>;
	constructor(private _helpService: HelpService) {
	}
	@Output() close: EventEmitter<any> = new EventEmitter();
	ngOnInit() {
		this.getHelp();
	}
	getHelp() {
		this._helpService.getHelp()
			.subscribe(
				result => this.helpList =result,
				error => console.log(error)
			)
	}
	sendText() {
		this.close.emit('');
	}
}
