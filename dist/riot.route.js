;(function(riot) { if (!window) return;

/**
 * Simple client-side router
 * @module riot-route
 */


var EVT = 'hashchange', win = window, loc = win.location, started = false, fns = observable(), current

/**
 * Get hash part of current URL
 * @returns {string} hash string
 */
function hash() {
  return loc.href.split('#')[1] || '' // why not loc.hash.splice(1) ?
}

/**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path
 * @returns {*} array or object as you like
 */
function parser(path) {
  return path.split('/')
}

function emit(path) {
  if (path.type) path = hash()

  if (path != current) {
    fns.trigger.apply(null, ['H'].concat(parser(path)))
    current = path
  }
}

var route = function(arg) {
  // string
  if (arg[0]) {
    loc.hash = arg
    emit(arg)

  // function
  } else {
    fns.on('H', arg)
  }
}

/**
 * Exec routing right now
 * @param {function} fn - your action
 */
route.exec = function(fn) {
  fn.apply(null, parser(hash()))
}

/**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 */
route.parser = function(fn) {
  parser = fn
}

/** Stop routing **/
route.stop = function () {
  if (started) {
    win.removeEventListener(EVT, emit, false)
    fns.off('*')
    started = false
  }
}

/** Start routing **/
route.start = function () {
  if (!started) {
    win.addEventListener(EVT, emit, false)
    started = true
  }
}

/** Autostart the router **/
route.start()

riot.route = route })(riot)
