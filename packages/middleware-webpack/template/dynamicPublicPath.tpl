var source = document.currentScript
  ? document.currentScript.src
  : document.scripts[document.scripts.length - 1].src;
var match = /(.*\/)${scriptSrcPrefix}\//.exec(source);
if (match && match[1]) {
  __webpack_public_path__ = match[1];
}
