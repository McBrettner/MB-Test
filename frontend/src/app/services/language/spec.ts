/* beautify ignore:start */
import {it, inject, beforeEachProviders} from '@angular/core/testing';
import {LanguageService} from './index';
/* beautify ignore:end */

describe('Service: LanguageService', () => {

    beforeEachProviders(() => [LanguageService]);

    it('should be defined', inject([LanguageService], (service: LanguageService) => {
        expect(service).toBeDefined();
    }));

});
