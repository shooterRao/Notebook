/**
 * 节流函数
 * @param {Function} func
 * @param {Number} wait
 * @param {Object} options
 * @returns {Function}
 */
export const throttle = (func, wait, options) => {
  let context, args, result;

  let timeout = null;

  let previous = 0;

  if (!options) options = {};

  const later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);

    if (!timeout) context = args = null;
  };

  return function() {
    const now = Date.now();

    if (!previous && options.leading === false) {
      previous = now;
    }

    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;

      result = func.apply(context, args);

      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};