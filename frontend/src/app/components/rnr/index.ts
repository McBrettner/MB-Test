/* beautify ignore:start */
import {Component, ElementRef, Input, AfterViewInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {RnrService, RnrFeedback} from './../../services/rnr';
import {HTTPDialogService} from './../../services/dialog';
/* beautify ignore:end */

@Component({
	selector: 'rnr',
	providers: [RnrService],
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class RnrComponent implements AfterViewInit {
	@ViewChild('wrapper') helperContent: ElementRef;
	@Input() id: string = '';
	content: string = '';
	fullText: string = '';
	shortText: string = '';
	limit: number = 200;
	expanded: boolean = false;
	feedbackStatus;
	constructor(private dialogService: HTTPDialogService, private rnrService: RnrService, private changeDetectionRef: ChangeDetectorRef) {
	}
	ngAfterViewInit() {
		this.fullText = this.helperContent.nativeElement.innerHTML;
		this.fullText = this.fullText.replace(/\&nbsp;/g, ' ');
		this.shortText = this.limit > this.fullText.length ? this.fullText : this.fullText.substring(0, this.limit - 3) + '...';
		this.content = this.shortText;
		this.changeDetectionRef.detectChanges();
	}
	expand() {
		if (this.expanded) {
			this.content = this.shortText;
			this.expanded = false;
		} else {
			this.content = this.fullText;
			this.expanded = true;
		}
	}
	sendFeedback(rank: string) {
		let feedback = new RnrFeedback();
		feedback.context = this.dialogService.getContext();
		feedback.id = this.id;
		feedback.feedback = rank;
		this.rnrService.sendFeedback(feedback)
		.subscribe(
			(status: boolean) => this.feedbackStatus,
			() => { this.feedbackStatus = false; }
		);
	}
}
