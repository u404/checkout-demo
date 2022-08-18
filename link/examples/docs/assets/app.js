/* global launchPlink, createCodeElement, uuidv4 */

const button = document.getElementById('submit-btn');
const config = {
  amount: 10359,
  currency: 'EUR',
  billing: {
    address: {
      country: 'DE',
    },
  },
  products: [
    {
      name: 'Moonlight blue lightsaber',
      quantity: 2,
      price: 3999,
    },
    {
      name: 'Stainless steel watch strap',
      quantity: 1,
      price: 2361,
    },
  ],
  reference: generateReference(),
  return_url: window.location.href,
};

const jsonPreElement = document.getElementById('payment-link-pre');
const codeElement = createCodeElement(config);
jsonPreElement.appendChild(codeElement);

const isDevOrQa =
  window.location.hostname.indexOf('cko-dev.ckotech.co') >= 0 ||
  window.location.hostname.indexOf('cko-qa.ckotech.co') >= 0;

const SBOX_SK = 'sk_test_fa5c30ce-6ab2-42cf-a110-3c508f6614d7';
const QA_SK = 'sk_test_28fdc614-7fd8-49c7-b36a-dcd7ae7b213e';

button.onclick = function (event) {
  event.preventDefault();
  event.target.disabled = true;
  const secretKey = isDevOrQa ? QA_SK : SBOX_SK;
  launchPlink(config, secretKey, codeElement, button);
};

function generateReference() {
  return 'cko_plink_' + uuidv4();
}
