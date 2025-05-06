import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TodoService } from './todo.service';

@NgModule({
  providers: [TodoService],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('CoreModule은 한 번만 로드할 수 있습니다.');
    }
  }
}
