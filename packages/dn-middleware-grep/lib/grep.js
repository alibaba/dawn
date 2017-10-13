function removeComments(srcCode) {
  let dstCode = srcCode;
  dstCode = dstCode.replace(/\/\/.+/gm, ' ');
  dstCode = dstCode.replace(/\/\*[\s\S]+?\*\//g, ' ');
  return dstCode;
}

function removeStrings(srcCode) {
  let dstCode = srcCode;
  dstCode = dstCode.replace(/'.+?'/gm, ' ');
  dstCode = dstCode.replace(/".+?"/gm, ' ');
  return dstCode;
}

function cleanCode(srcCode) {
  let dstCode = srcCode
  dstCode = removeComments(dstCode);
  dstCode = removeStrings(dstCode);
  return dstCode;
}

exports.scan = function (srcCode, words) {
  let messages = [];
  if (!words || words.length < 1) return messages;
  let dstCode = cleanCode(srcCode);
  console.log(dstCode)
  words.forEach(word => {
    if (dstCode.indexOf(word) > -1) {
      messages.push(`查找到了指定词语 "${word}"`);
    }
  });
  return messages;
};