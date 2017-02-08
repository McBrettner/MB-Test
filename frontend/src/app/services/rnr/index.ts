/* beautify ignore:start */
import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {LanguageService} from './../language';
import {Observable} from 'rxjs/Observable';
/* beautify ignore:end */

export class RnrFeedback {
	context: {};
	id: string;
	feedback: string;
}

@Injectable()
export class RnrService {
	constructor (private http: Http) {
	}
	sendFeedback (feedback: RnrFeedback): Observable<boolean> {
		return this.http.post('/api/rnrfeedback', JSON.stringify(feedback))
		.map(this.extractResponse);
	}
	private extractResponse (res: Response): boolean {
		if (res.status < 200 || res.status >= 300) {
			return false;
		} else {
			return true;
		}
	}
}
