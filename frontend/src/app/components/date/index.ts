/* beautify ignore:start */
import {Component, ElementRef, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {LanguageService} from './../../services/language';
/* beautify ignore:end */

@Component({
	selector: 'mct:date',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class DateComponent implements AfterViewInit {
	dateString: String;
	date: Date;
	@ViewChild('date') origDate: ElementRef;
	constructor(private changeDetectorRef: ChangeDetectorRef, private languageService: LanguageService) {
	}
	ngAfterViewInit() {
		this.date = this.parseDate(this.origDate);
		this.dateString = this.printDate(this.date);
		this.changeDetectorRef.detectChanges();
	}
	parseDate(date): Date {
		return new Date(this.origDate.nativeElement.innerText);
	}
	printDate(date): String {
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		switch(this.languageService.getLanguage()) {
			case 'cs':
				return date.toLocaleDateString('cs-CS', options);
			case 'en':
			default:
				return date.toLocaleDateString('en-US', options);
		}

	}
}
