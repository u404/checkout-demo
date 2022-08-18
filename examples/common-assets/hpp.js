/* global uuidv4 */

var HPP_URL_BASE = getHppApiUrlBase();
var CREATE_PAYMENT_PATH = '/hosted-payments';
var HPP_CREATE_PAYMENT_URL = HPP_URL_BASE + CREATE_PAYMENT_PATH;

var defaultConfig = {
  amount: 1000,
  billing: {
    address: {
      country: 'DE',
    },
  },
  currency: 'USD',
  reference: '123456',
  capture: false,
  payment_ip: '127.0.0.1',
  products: [
    {
      name: 'Battery Power Pack 1',
      quantity: 1,
      price: 1000,
    },
    {
      name: 'USB-C Charging Cable',
      quantity: 4,
      price: 435,
    },
  ],
  '3ds': {
    enabled: true,
  },
  customer: {
    email: 'jokershere@gmail.com',
    name: 'Jack Napier',
  },
  success_url: window.location.origin + '/examples/success',
  failure_url: window.location.origin + '/examples/failure',
  cancel_url: window.location.origin + '/examples/shopping-cart?cancel=true',
};

function getHppApiUrlBase() {
  // switch (window.location.hostname) {
  //   case 'localhost': {
  //     if (window.location.port === '3001') {
  //       return 'http://localhost:3001';
  //     }

  //     return 'http://localhost:3000';
  //   }

  //   case 'pay.checkout.com':
  //     return 'https://api.checkout.com';

  //   case 'pay.sandbox.checkout.com':
  //     return 'https://api.sandbox.checkout.com';

  //   default:
  //     return window.location.origin;
  // }
  return 'https://api.sandbox.checkout.com';
}

window.createHPPRedirect = createHPPRedirect;
function createHPPRedirect(config, secretKey) {
  config = config || defaultConfig;

  window
    .fetch(HPP_CREATE_PAYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: secretKey || 'sk_test_b2e2f327-a7b0-4303-8007-049a8157e493',
        'x-correlation-id': config.reference || 'cko_hpp_' + uuidv4(),
      },
      body: JSON.stringify(config),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      const paymentPageUrl = result._links.redirect.href;

      if (paymentPageUrl) {
        window.location = paymentPageUrl;
      } else {
        console.warn('Failed to create HPP', result);
      }
    });
}
