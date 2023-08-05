import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";
import Toast from "bootstrap/js/dist/toast";
import Popover from "bootstrap/js/dist/popover";

class Bootstrap {
  hideModal (id) {
    const instance = Modal.getInstance(id);
    if (instance) {
      instance.hide();
    }
  }

  showModal (id) {
    const modal = new Modal(id);
    modal.show();
  }

  showToast (id) {
    const toast = new Toast(id);
    toast.show();
  }

  initPopover () {
    const popoverTriggerList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
    [...popoverTriggerList].forEach(popoverTriggerEl => new Popover(popoverTriggerEl));
  }

  disposePopover () {
    const popoverTriggerList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
    [...popoverTriggerList].forEach((popoverTriggerEl) => {
      const popover = Popover.getInstance(popoverTriggerEl);
      if (popover) {
        popover.dispose();
      }
    });
  }
}

const bootstrap = new Bootstrap();

export default defineNuxtPlugin(() => {
  return {
    provide: { bootstrap }
  };
});
