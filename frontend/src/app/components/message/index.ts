/* beautify ignore:start */
import {Component, Input, OnInit, AfterViewInit, ComponentFactoryResolver, Injector, Output, ComponentRef, ElementRef, ViewEncapsulation, ApplicationRef, ViewChildren, ChangeDetectorRef, ViewContainerRef, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {InputImageComponent} from './../inputimage';
import {InputComponent} from './../input';
import {ImageComponent} from './../image';
import {SuggestComponent} from './../suggest';
import {DateComponent} from './../date';
import {FeedbackComponent} from './../feedback';
import {RnrComponent} from './../rnr';
import {UserService, User} from './../../services/user';
import {DynamicComponentModule} from 'angular2-dynamic-component/index';
/* beautify ignore:end */

@NgModule({
	declarations: [InputImageComponent, InputComponent, ImageComponent, SuggestComponent, DateComponent, FeedbackComponent, RnrComponent],
	exports: [InputImageComponent, InputComponent, ImageComponent, SuggestComponent, DateComponent, FeedbackComponent, RnrComponent],
	imports: [ FormsModule, BrowserModule],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RenderContentModule {
}

@Component({
	selector: 'message',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class MessageComponent implements OnInit, AfterViewInit {
	init: boolean;
	user: User;
	userInitials: string;
	lastMessage: number = 0;
	showMessage: string[];
	dynamicComponentModules: any[] = [RenderContentModule];
	@ViewChildren('messageContent') messageContent: any;
	@ViewChildren('render-content', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
	@Input() message: Message;
	@Input() id: string;

	constructor(private userService: UserService, private appRef: ApplicationRef, private _changeDetectionRef: ChangeDetectorRef, private resolver: ComponentFactoryResolver) {
	}
	ngOnInit() {
		// this.getUser();
	}
	ngAfterViewInit() {
		this.init = true;
	}
	getUser() {
		this.userService.getUser((user: User) => {
			this.user = user;
			this.getUserInitials(this.user);
		});
	}
	getUserInitials(user: User) {
		this.userInitials = user.name.split(' ')
		.map((str) => str.substring(0, 1))
		.join('');
	}
	getProfileImageLink() {
		// return 'black';
		// console.log('url(http://faces.tap.ibm.com/imagesrv/' + this.user.UID + '.jpg)');
		return this.user && this.user.UID ? 'url(http://faces.tap.ibm.com/imagesrv/' + this.user.UID + '.jpg)' : 'none';
	}
	isMessageEmpty(id: number, i: number) {
		if (this.init && this.messageContent && this.message.isFromWatson()) {
			let elementId = '_' + id + '_' + i;
			this.showMessage = this.showMessage || [];
			let prev = this.showMessage[i];
			this.showMessage[i] = this.messageContent._results.filter((el) => el.element.nativeElement.id === elementId)[0].componentTemplate.length ? 'visible' : 'none';
			if (prev !== this.showMessage[i]) {
				this._changeDetectionRef.detectChanges();
			}
			if (this.showMessage[i] === 'none') {
				return this.showMessage[i];
			}
		}
	}
	lastNotEmptyMessage(i: number) {
		if (this.init && this.showMessage) {
			if (this.showMessage[i] === 'visible' && i > this.lastMessage) {
				this.lastMessage = i;
				this._changeDetectionRef.detectChanges();
			} else if (this.showMessage[i] === 'none' && i === this.lastMessage && i !== 0) {
				this.lastMessage = 0;
			}
			return this.lastMessage === i;
		}
	}
}

export enum Author {
	WATSON,
	USER
}

export class Message {
	type: string;
	context: {};
	data: string[];
	author: Author;
	lang: string;
	constructor(data?: string[], author?: Author) {
		this.type = 'plain/text';
		this.data = data || [''];
		this.author = author || Author.WATSON;
		this.context = {};
	}
	public getAuthorName = () => Author[this.author];
	public getText = () => this.data.join();
	public isFromUser = () => this.author === Author.USER;
	public isFromWatson = () => this.author === Author.WATSON;
	public toString = () => JSON.stringify(this);
	public getContext = () => this.context;
}
