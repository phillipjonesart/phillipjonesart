// Lays each gallery out in rows where every picture in a row is the same height
// and the row fills the page width. Pictures keep their real shapes (no cropping, no bars).
(function () {
  function layout(grid) {
    var tiles = Array.prototype.slice.call(grid.children);
    var W = grid.clientWidth;
    var style = getComputedStyle(grid);
    var gap = parseFloat(style.columnGap) || 0;
    var target = parseFloat(grid.getAttribute('data-row')) || 320;
    if (W < 600) { // phones: one piece per row, full width
      tiles.forEach(function (t) { t.style.width = '100%'; });
      return;
    }
    var row = [], sum = 0, extra = 0;
    function place(items, h) {
      items.forEach(function (t) {
        t.style.width = (t._r * h + t._x) + 'px';
      });
    }
    function rowHeight(s, n, x) { return (W - gap * (n - 1) - x) / s; }
    tiles.forEach(function (t, i) {
      t._r = parseFloat(t.style.getPropertyValue('--r')) || 1;
      t._x = (t.querySelectorAll('.pic').length - 1) * 10; // gaps between pictures inside one tile
      var hWith = rowHeight(sum + t._r, row.length + 1, extra + t._x);
      if (hWith <= target && row.length) {
        // the row is full: end it either before or after this piece, whichever keeps heights closer to the target
        var hWithout = rowHeight(sum, row.length, extra);
        if (Math.abs(hWithout - target) < Math.abs(hWith - target)) {
          place(row, Math.min(hWithout, target * 1.5));
          row = [t]; sum = t._r; extra = t._x;
          return;
        }
        row.push(t); place(row, hWith);
        row = []; sum = 0; extra = 0;
        return;
      }
      row.push(t); sum += t._r; extra += t._x;
    });
    if (row.length) place(row, Math.min(target, (W - gap * (row.length - 1) - extra) / sum));
  }
  function all() {
    var grids = document.querySelectorAll('.grid');
    for (var i = 0; i < grids.length; i++) { grids[i].classList.add('rows'); layout(grids[i]); }
  }
  var timer;
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(all, 80); });
  all();
})();
