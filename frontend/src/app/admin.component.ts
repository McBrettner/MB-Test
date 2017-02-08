/*
 * Angular 2 decorators and services
 */
import { Component } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
	selector: 'admin',
	styles: [
		require('purecss/build/pure-min.css'),
		require('purecss/build/grids-responsive-min.css'),
		require('./style.scss')
	],
	template: require('./admin-template.html'),
})
export class Admin {
}
