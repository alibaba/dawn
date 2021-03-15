$(function () {
  // gheading links
  $('#docs-content').find('a[name]').each(function () {
    var anchor = $('<a href="#' + this.name + '"/>');
    $(this).parent().next().wrapInner(anchor);
  })
});