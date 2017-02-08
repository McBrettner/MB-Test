import { NgModule, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTING } from './app.routes';
// App is our top level component
import { Base } from './base.component';
import { App } from './app.component';
import { Admin } from './admin.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InteralStateType } from './app.service';

import {Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {DynamicComponentModule} from 'angular2-dynamic-component/index';

import {LanguageService} from './services/language';
import {UserService} from './services/user';
import {DialogComponent} from './components/dialog';
import {UserInfoComponent} from './components/userinfo';
import {HelpComponent} from './components/help';
import {LanguageComponent} from './components/language';
import {MessageComponent, RenderContentModule} from './components/message';
import {InputComponent} from './components/input';
import {FeedbackComponent} from './components/feedback';
import {SuggestComponent} from './components/suggest';

// Application wide providers
const APP_PROVIDERS = [
	...APP_RESOLVER_PROVIDERS,
	LanguageService,
	UserService,
	AppState
];

type StoreType = {
	state: InteralStateType,
	restoreInputValues: () => void,
		disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
	bootstrap: [ Base ],
	declarations: [
		Base,
		App,
		Admin,
		DialogComponent,
		UserInfoComponent,
		HelpComponent,
		LanguageComponent,
		MessageComponent,
	],
	imports: [ // import Angular's modules
		DynamicComponentModule,
		BrowserModule,
		FormsModule,
		HttpModule,
		RenderContentModule,
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/lang', '.json'),
			deps: [Http]
		}),
		ROUTING
	],
	providers: [ // expose our Services and Providers into Angular's dependency injection
		ENV_PROVIDERS,
		APP_PROVIDERS
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
	constructor(public appRef: ApplicationRef, public appState: AppState) {}

	hmrOnInit(store: StoreType) {
		if (!store || !store.state) return;
		console.log('HMR store', JSON.stringify(store, null, 2));
		// set state
		this.appState._state = store.state;
		// set input values
		if ('restoreInputValues' in store) {
			let restoreInputValues = store.restoreInputValues;
			setTimeout(restoreInputValues);
		}

		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}

	hmrOnDestroy(store: StoreType) {
		const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
		// save state
		const state = this.appState._state;
		store.state = state;
		// recreate root elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// save input values
		store.restoreInputValues  = createInputTransfer();
		// remove styles
		removeNgStyles();
	}

	hmrAfterDestroy(store: StoreType) {
		// display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}

}
