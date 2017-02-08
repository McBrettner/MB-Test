/* beautify ignore:start */
import {Component, ViewChild, Input} from '@angular/core';
import {HTTPDialogService} from './../../services/dialog';
/* beautify ignore:end */

@Component({
	selector: 'feedback',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class FeedbackComponent {
	@Input('message-context') messageContext: {};
	@ViewChild('button') button: HTMLElement;
	comment: string;
	rating: number;
	submitted: boolean;
	constructor(private _dialogService: HTTPDialogService) {
	};
	send(finished: boolean) {
		let feedback: Feedback = new Feedback();
		feedback.message_context = this.messageContext;
		feedback.answer_user_rating = this.rating;
		if (this.comment) {
			feedback.answer_rating_comment = this.comment;
		}
		this._dialogService.sendFeedback(feedback);
		this.submitted = finished;
	};
}

export class Feedback {
	message_context: {};
	answer_user_rating: number;
	answer_rating_comment: string;
}
