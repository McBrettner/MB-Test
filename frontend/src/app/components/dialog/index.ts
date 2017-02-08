/* beautify ignore:start */
import {Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef, AfterViewInit, OnChanges} from '@angular/core';
import {MessageComponent, Message, Author} from './../message';
import {InputComponent} from './../input';
import {LanguageComponent} from './../language';
import {HTTPDialogService} from './../../services/dialog';
import {SpeechService} from './../../services/speech';
import {LanguageService} from './../../services/language';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
/* beautify ignore:end */

@Component({
	selector: 'dialog',
	providers: [HTTPDialogService, SpeechService],
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class DialogComponent implements OnInit, AfterViewInit, OnChanges {
	@Input('user-input') userInput: string;
	@ViewChild('inputBox') inputBox: ElementRef;
	@ViewChild('messageContainer') messageContainer: ElementRef;
	@ViewChild('fixedPanel') fixedPanel: ElementRef;
	messages: Message[] = [];
	suggestions: string[] = [];
	typingMessage: Message = new Message(['Typing...'], Author.WATSON);
	audioOutput: boolean = false;
	listening: boolean = false;
	loading: boolean = false;

	constructor(private _dialogService: HTTPDialogService, private _changeDetectionRef: ChangeDetectorRef, private _speechService: SpeechService) {
	}
	ngOnInit() {
		this._dialogService.onMessage((message: Message): any => {
			this.onMessage(message);
		});
		this._dialogService.initConversation();
		this.loading = true;
	}
	ngAfterViewInit() {
		this.inputBox.nativeElement.focus();
		this.messageContainer.nativeElement.hidden = true;
	}
	ngOnChanges() {
		if (this.userInput) {
			let message = this.userInput;
			this.userInput = '';
			this.sendText(message);
		}
	}
	listenOnMicrophone() {
		this.listening = true;
		this._speechService.listen();
	}
	stopListenOnMicrophone() {
		this.listening = false;
		this._speechService.stopListen((text: string) => {
			if (typeof text === 'string' && text.length > 0) {
				this.sendText(text);
			}
		});
	}
	audioSwitch() {
		this.audioOutput = !this.audioOutput;
		this._speechService.audioSwitch();
	}
	sendText(text: string) {
		let newMessage = new Message();
		newMessage.data = [text];
		newMessage.author = Author.USER;
		this.messages.push(newMessage);
		this.scrollDown();
		this.loading = true;
		this._dialogService.sendMessage(newMessage);
	}
	onMessage(message: Message) {
		this.messageContainer.nativeElement.hidden = false;
		this.loading = false;
		this.messages.push(message);
		this.suggestions = [];
		if (this.audioOutput) {
			this._speechService.talk(message.getText());
		}
		this.scrollDown();
		setTimeout(() => {
			this.messageContainer.nativeElement.style.paddingBottom = (this.fixedPanel.nativeElement.clientHeight - 30).toString() + 'px';
		});
	}
	addSuggestion(text: string) {
		this.suggestions.push(text);
		this._changeDetectionRef.detectChanges();
	}
	scrollDown() {
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

			let getDocHeight = function() {
				let D = document;
				return Math.max(
					Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
					Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
					Math.max(D.body.clientHeight, D.documentElement.clientHeight)
				);
			};

			// Function to animate the scroll
			let smoothScroll = function (anchor, duration) {

				// Calculate how far and how fast to scroll
				let startLocation = window.pageYOffset;
				let endLocation = getDocHeight(); // document.body.scrollHeight; //anchor.scrollHeight;
				let distance = endLocation - startLocation;
				let increments = distance / (duration / 20);
				let stopAnimation;

				// Scroll the page by an increment, and check if it's time to stop
				let animateScroll = function () {
					window.scrollBy(0, increments);
					stopAnimation();
				};

				let runAnimation;
				// If scrolling down
				if ( increments >= 0 ) {
					// Stop animation when you reach the anchor OR the bottom of the page
					stopAnimation = function () {
						let travelled = window.pageYOffset;
						if ( (travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= getDocHeight()) ) {
							clearInterval(runAnimation);
						}
					};
				} else {
					// If scrolling up
					// Stop animation when you reach the anchor OR the top of the page
					stopAnimation = function () {
						let travelled = window.pageYOffset;
						if ( travelled <= (endLocation || 0) ) {
							clearInterval(runAnimation);
						}
					};
				}

				// Loop the animation function
				runAnimation = setInterval(animateScroll, 20);

			};
			smoothScroll(this.messageContainer.nativeElement, 1000);

		}
	}
}

