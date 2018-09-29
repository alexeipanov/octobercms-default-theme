export default class Modal {
  constructor(id) {
    this.id = id;
    let modal = document.getElementById(this.id);
    let background, okButton, cancelButton, closeButton, dialogWindow;
    try {
      background = modal.querySelector('.background');
      dialogWindow = modal.querySelector('.window');
      okButton = modal.querySelector('button.ok');
      cancelButton = modal.querySelector('button.cancel');
      closeButton = modal.querySelector('.close');
    }
    catch(error) {
      console.log(error);
      return false;
    }
    background.addEventListener('animationend', () => this.toggleHandler());
    if (okButton) {
      okButton.addEventListener('click', event => this.okHandler(event));
    }
    if (cancelButton) {
      cancelButton.addEventListener('click', event => this.cancelHandler(event));
    }
    if (closeButton) {
      closeButton.addEventListener('click', event => this.cancelHandler(event));
    }
    background.addEventListener('click', event => this.cancelHandler(event));
    dialogWindow.addEventListener('click', event => event.stopPropagation());
  }

  okHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this.close(true);
  }

  cancelHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    this.close(false);
  }

  toggleHandler() {
    let modal = document.getElementById(this.id);
    if (modal.classList.contains('close')) modal.classList.add('hidden');
  }

  show(handler) {
    let modal = document.getElementById(this.id);
    modal.classList.remove('hidden');
    modal.classList.toggle('open');
    modal.classList.toggle('close');
    this.windowHandler = handler;
  }

  close(result) {
    let modal = document.getElementById(this.id);
    modal.classList.remove('open');
    modal.classList.add('close');
    this.windowHandler(result);
  }
}
