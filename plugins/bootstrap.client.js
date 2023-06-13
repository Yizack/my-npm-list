import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/dropdown";
import Popover from "bootstrap/js/dist/popover";
import Modal from "bootstrap/js/dist/modal";

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

  enablePopovers () {
    const popoverTriggerList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
    [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl, {
      boundary: "window",
      trigger: "hover",
      placement: "right"
    }));
  }
};

const bootstrap = new Bootstrap();

export default defineNuxtPlugin(() => {
  return {
    provide: { bootstrap }
  };
});
