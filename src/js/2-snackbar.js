import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import iconError from '../img/icon-error.svg';
import iconSuccess from '../img/icon-ok.svg';

const iziToastConfig = {
  position: 'topCenter',
  titleColor: '#FFF',
  titleSize: '16',
  titleLineHeight: '24',
  messageColor: '#FFF',
  messageSize: '16',
  messageLineHeight: '24',
};

const formEl = document.querySelector('.form');
formEl.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();

  const formData = e.currentTarget.elements;
  const delay = Number(formData.delay.value);
  const state = formData.state.value;

  const makePromise = (delay, state) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  };

  makePromise(delay, state)
    .then(delay => {
      iziToast.success({
        ...iziToastConfig,
        title: 'OK',
        message: `Fulfilled promise in ${delay}ms`,
        backgroundColor: '#59A10D',
        iconUrl: iconSuccess,
      });
    })
    .catch(delay => {
      iziToast.error({
        ...iziToastConfig,
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
        backgroundColor: '#EF4040',
        iconUrl: iconError,
      });
    });

  e.currentTarget.reset();
}
