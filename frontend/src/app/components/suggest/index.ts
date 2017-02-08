/* beautify ignore:start */
import {Component, ElementRef, Input, AfterViewInit, ViewChild} from '@angular/core';
/* beautify ignore:end */

@Component({
	selector: 'suggest',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class SuggestComponent implements AfterViewInit {
	@Input() text = '';
	init: boolean = false;
	constructor(private el: ElementRef) {
	}
	ngAfterViewInit() {
		if (!this.init) {
			this.init = true;
			this.el.nativeElement.dispatchEvent(new CustomEvent('addSuggestion', {
				bubbles: true,
				detail: this.text
			}));
		}
	}
}
