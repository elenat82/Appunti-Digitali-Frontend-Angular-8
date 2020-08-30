import { Injectable } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerOverlayComponent } from 'src/app/modules/spinner/spinner-overlay/spinner-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerOverlayService {

  private overlayRef: OverlayRef = null;
  private componentInstance;

  constructor(private overlay: Overlay) { }

  public show(percent = 0) {
    // Returns an OverlayRef (which is a PortalHost)

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create();
    }

    // Create ComponentPortal that can be attached to a PortalHost
    const spinnerOverlayPortal = new ComponentPortal(SpinnerOverlayComponent);

    // run in async context for triggering "tick", thus avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.componentInstance = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
      (this.componentInstance.instance as any).percent = percent;
    });

  }

  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
    }
  }

  public updatePercent(updatedPercent) {
    (this.componentInstance.instance as any).percent = updatedPercent;
  }
}
