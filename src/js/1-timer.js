import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import iconError from '../img/icon-error.svg';

const iziToastConfig = {
  position: 'topCenter',
  titleColor: '#FFF',
  titleSize: '16',
  titleLineHeight: '24',
  messageColor: '#FFF',
  messageSize: '16',
  messageLineHeight: '24',
  backgroundColor: '#EF4040',
  iconUrl: iconError,
};

const inputDateTimePickerEl = document.querySelector('#datetime-picker');

const startBtn = document.querySelector('button[data-start]');
startBtn.setAttribute('disabled', '');
startBtn.addEventListener('click', onClickStartTimer);

const timerElements = {
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

let userSelectedDate = null;
let timerIntervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  disableMobile: 'true',
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      startBtn.setAttribute('disabled', '');
      errorMessage();
    } else {
      startBtn.removeAttribute('disabled');
      userSelectedDate = selectedDates[0];
    }
  },
};

function errorMessage() {
  iziToast.error({
    ...iziToastConfig,
    title: 'Error',
    message: 'Please choose a date in the future',
  });
}

flatpickr(inputDateTimePickerEl, options);

function onClickStartTimer() {
  timerIntervalId = setInterval(updateTimer, 1000);
  startBtn.setAttribute('disabled', '');
  inputDateTimePickerEl.setAttribute('disabled', '');
}

function updateTimer() {
  const currentTime = Date.now();
  const userSelectedTime = userSelectedDate.getTime();
  const timeLeft = userSelectedTime - currentTime;

  if (timeLeft <= 0) {
    clearInterval(timerIntervalId);
    updateDisplay(0);
    inputDateTimePickerEl.removeAttribute('disabled');
  } else {
    updateDisplay(timeLeft);
  }
}

function updateDisplay(time) {
  const { days, hours, minutes, seconds } = convertMs(time);

  timerElements.days.textContent = addLeadingZero(days);
  timerElements.hours.textContent = addLeadingZero(hours);
  timerElements.minutes.textContent = addLeadingZero(minutes);
  timerElements.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
