/* global createHPPRedirect, uuidv4 */

const button = document.getElementById('button');
const config = {
  amount: 174996,
  currency: 'EUR',
  billing: {
    address: {
      country: 'DE',
    },
  },
  products: [
    {
      name: '144Hz gaming monitor',
      quantity: 2,
      price: 69999,
    },
    {
      name: 'Wireless gaming mouse',
      quantity: 1,
      price: 14999,
    },
    {
      name: 'Mechanical switch keyboard with wrist rest',
      quantity: 1,
      price: 19999,
    },
  ],
  reference: generateReference(),
  success_url: window.location.origin + '/examples/docs-example/?success=true',
  failure_url: window.location.origin + '/examples/docs-example/?failure=true',
  cancel_url: window.location.origin + '/examples/docs-example/?cancel=true',
};

const isDevOrQa =
  window.location.hostname.indexOf('cko-dev.ckotech.co') >= 0 ||
  window.location.hostname.indexOf('cko-qa.ckotech.co') >= 0;

const SBOX_SK = 'sk_test_3a43a644-3160-48bf-92e6-bc5939c67906';
const QA_SK = 'sk_test_28fdc614-7fd8-49c7-b36a-dcd7ae7b213e';

button.addEventListener('click', function (event) {
  event.preventDefault();
  event.target.disabled = true;
  const secretKey = isDevOrQa ? QA_SK : SBOX_SK;
  createHPPRedirect(config, secretKey);
});

const message = document.getElementById('message');
const queryString = window.location.search;

if (queryString.indexOf('success=true') !== -1) {
  message.textContent = 'Your test payment was successfully completed!';
}

if (queryString.indexOf('failure=true') !== -1) {
  message.textContent = 'Your test payment was unsuccessful.';
}

if (queryString.indexOf('cancel=true') !== -1) {
  message.textContent = 'Your test payment was cancelled.';
}

function generateReference() {
  return 'cko_hpp_' + uuidv4();
}