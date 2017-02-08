/* beautify ignore:start */
import {Component, ElementRef, Input} from '@angular/core';
/* beautify ignore:end */

@Component({
	selector: 'imageinput',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class InputImageComponent {
	@Input() src;
	@Input() alt = '';
	constructor(private el: ElementRef) {
	}
	fireUserInputEvent(event: any) {
		let text: String = '';
		if (event.target.tagName.toLowerCase() === 'button') {
			text = event.target.querySelectorAll('span').item(0).innerHTML;
		} else {
			text = event.target.parentElement.querySelectorAll('span').item(0).innerHTML;
		}
		this.el.nativeElement.dispatchEvent(new CustomEvent('customUserInput', {
			bubbles: true,
			detail: text
		}));
	}
}
