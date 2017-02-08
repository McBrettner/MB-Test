/* beautify ignore:start */
import {it, injectAsync, beforeEachProviders} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {LanguageComponent} from './index';
/* beautify ignore:end */

describe('Component: LanguageComponent', () => {

            beforeEachProviders(() => []);

            it('should be defined', injectAsync([TestComponentBuilder], (tcb) => {
                            return tcb.createAsync(LanguageComponent)
                                .then((fixture) => {
                                        let element = fixture.debugElement.nativeElement;
                                        let cmpInstance = <LanguageComponent>fixture.debugElement.componentInstance;
                fixture.detectChanges();

                expect(cmpInstance).toBeDefined();
                expect(element).toBeDefined();
            });
    }));

});
