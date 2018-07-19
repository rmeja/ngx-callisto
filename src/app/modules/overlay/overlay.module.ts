import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefiNotificationsService } from './providers/notifications.service';
import { DefiNotificationsComponent } from './notifications/notifications.component';
import { PopupComponent, BodyDirective } from './popup/popup.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DefiNotificationsComponent,
    PopupComponent,
    BodyDirective
  ],
  exports: [
    DefiNotificationsComponent,
    PopupComponent,
    BodyDirective
  ]
})
export class DefiOverlayModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DefiOverlayModule,
      providers: [
        DefiNotificationsService,
      ]
    };
  }
}
