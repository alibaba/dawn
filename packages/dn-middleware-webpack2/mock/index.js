const list = require('./gui.data.json');

const req = require.context('./', true, /\.js$/);
req.keys().forEach(key => {
  req(key);
});

let globalItem = list.find(item => item.global) || {};
faked.global = globalItem.content;

let checkedItems = list.filter(item => item.checked);
faked.fromJson(checkedItems);