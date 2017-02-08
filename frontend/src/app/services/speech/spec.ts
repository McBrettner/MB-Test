/* beautify ignore:start */
import {it, inject, beforeEachProviders} from '@angular/core/testing';
import {SpeechService} from './index';
/* beautify ignore:end */

describe('Service: SpeechService', () => {

    beforeEachProviders(() => [SpeechService]);

    it('should be defined', inject([SpeechService], (service: SpeechService) => {
        expect(service).toBeDefined();
    }));

});
