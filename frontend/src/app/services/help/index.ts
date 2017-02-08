import {Observable} from 'rxjs/Rx';
import {Http, Response} from '@angular/http';
import {LanguageService} from './../language';
import {Injectable} from '@angular/core';

@Injectable()
export class HelpService {
  private url: string = '/api/help';
  constructor (private http: Http, private languageService: LanguageService) {
	}
  getHelp (): Observable<Array<Object>> {
    switch (this.languageService.getLanguage()) {
      case'en':
      return this.http.get(this.url)
                    .map(response => response.json().en || { });
      case'cs':
      return this.http.get(this.url)
                    .map(response => response.json().cs || { });
    }
  }
}
