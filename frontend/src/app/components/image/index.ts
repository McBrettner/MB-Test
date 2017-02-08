/* beautify ignore:start */
import {Component, ElementRef, Input, AfterViewInit, ViewChild} from '@angular/core';
/* beautify ignore:end */

@Component({
	selector: 'image',
	styles: [require('./style.scss').toString()],
	template: require('./template.html')
})
export class ImageComponent implements AfterViewInit {
	@Input() src;
	@Input() alt = '';
	@ViewChild('image') image;
	constructor(private el: ElementRef) {
	}
	ngAfterViewInit() {
		// Get the modal
		let modal = document.getElementById('myModal');

		// Get the image and insert it inside the modal - use its 'alt' text as a caption
		let modalImg: HTMLImageElement = <HTMLImageElement>document.getElementById('img01');
		let captionText = document.getElementById('caption');
		this.image.nativeElement.onclick = function(){
			modal.style.display = 'block';
			modalImg.src = this.src;
			captionText.innerHTML = this.alt;
		};

		// Get the <span> element that closes the modal
		let span: HTMLElement = <HTMLElement>document.getElementsByClassName('close')[0];

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = 'none';
		};
		modal.onclick = function() {
			modal.style.display = 'none';
		};
	}
}
