import "bootstrap/js/dist/offcanvas";
import "bootstrap/js/dist/dropdown";

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
};

const bootstrap = new Bootstrap();

export default defineNuxtPlugin(() => {
  return {
    provide: { bootstrap }
  };
});
