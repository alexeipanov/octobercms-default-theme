import jQuery from 'jquery';
import Modal from './_modal';

window.$ = window.jQuery = jQuery;

window.addEventListener('load', function(event) {

  let testModal = new Modal('dialog');
  let dialogButton = document.querySelector('.window');
  dialogButton.addEventListener('click', (event) => {
    event.preventDefault();
    testModal.show((result) => console.log(result));
  });

});
