/* global Prism, uuidv4 */

var URL_BASE = getApiURLBase();
var PAYMENT_LINKS_PATH = '/payment-links';
var PAYMENT_LINKS_URL = URL_BASE + PAYMENT_LINKS_PATH;
var FADEOUT_TIME_IN_MS = 500;

function getApiURLBase() {
  // switch (window.location.hostname) {
  //   case 'localhost': {
  //     if (window.location.port === '4001') {
  //       return 'http://localhost:4001';
  //     }

  //     if (window.location.port === '3000') {
  //       return 'http://localhost:3000';
  //     }

  //     return 'api';
  //   }

  //   case 'pay.checkout.com':
  //     return 'https://api.checkout.com';

  //   case 'pay.sandbox.checkout.com':
  //     return 'https://api.sandbox.checkout.com';

  //   default:
  //     return 'api';
  // }

  return 'https://api.sandbox.checkout.com';
}

window.launchPlink = launchPlink;
function launchPlink(config, secretKey, preElement, button, onError) {
  disable(button);

  window
    .fetch(PAYMENT_LINKS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: secretKey,
        'x-correlation-id': config.reference || 'cko_plink_' + uuidv4(),
      },
      body: JSON.stringify(config),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (responseBody) {
      if (responseBody._links && responseBody._links.redirect.href) {
        fadeOut(preElement);
        setTimeout(onSuccessRequest(preElement, responseBody, button), FADEOUT_TIME_IN_MS);
      } else {
        console.error('Failed to create Payment link', responseBody);
        changeButton('Generate payment link');
        enable(button);
        if (onError) onError();
        throw new Error('Failed to create Payment link: ' + JSON.stringify(responseBody));
      }
    });

  changeButton('Generating payment link', true);
}

function fadeOut(element) {
  element.parentElement.classList.add('fade-out');
  element.parentElement.classList.remove('fade-in');
}

function onSuccessRequest(element, responseBody, button) {
  return function () {
    setResponse(element, responseBody, button);
    fadeInResponse(element);
  };
}

function setResponse(element, responseBody, button) {
  element.innerHTML = createCodeElement(responseBody).outerHTML;
  Prism.highlightElement(element);

  button.onclick = function () {
    disable(button);
    changeButton('Opening payment link page', true);
    window.location = responseBody._links.redirect.href;
  };

  changeButton('View payment link page', false);
  enable(button);
}

function createCodeElement(codeBody) {
  var codeElement = document.createElement('code');
  codeElement.innerHTML = JSON.stringify(codeBody, undefined, 2);
  codeElement.className = 'language-json';

  return codeElement;
}

function fadeInResponse(element) {
  element.parentElement.classList.add('fade-in');
  element.parentElement.classList.remove('fade-out');
}

function changeButton(buttonText, isLoading) {
  document.getElementById('button-text').textContent = buttonText;
  toggleSpinner(isLoading);
}

function toggleSpinner(isLoading) {
  document.getElementById('spinner').style.display = isLoading ? 'inline' : 'none';
}

function disable(button) {
  button.disabled = true;
}

function enable(button) {
  button.disabled = false;
}
