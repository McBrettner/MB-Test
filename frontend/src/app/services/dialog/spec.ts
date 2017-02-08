/* beautify ignore:start */
import {it, inject, beforeEachProviders} from '@angular/core/testing';
import {DialogService} from './index';
/* beautify ignore:end */

describe('Service: DialogService', () => {

    beforeEachProviders(() => [DialogService]);

    it('should be defined', inject([DialogService], (service: DialogService) => {
        expect(service).toBeDefined();
    }));

});
