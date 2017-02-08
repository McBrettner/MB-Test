/* beautify ignore:start */
import {Component, ElementRef} from '@angular/core';
/* beautify ignore:end */

@Component({
	selector: 'buttoninput',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class InputComponent {
	constructor(private el: ElementRef) {
	}
	fireUserInputEvent(event: any) {
		this.el.nativeElement.dispatchEvent(new CustomEvent('customUserInput', {
			bubbles: true,
			detail: event.target.innerText || event.target.innerHTML
		}));
	}
}
