// should we use core-js@3 ?
require('core-js/stable');
require('regenerator-runtime/runtime');

if (typeof window !== 'undefined') {
  require('whatwg-fetch');
}
