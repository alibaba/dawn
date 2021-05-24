function WebGLAnimation() {
  let context = null;
  let isAnimating = false;
  let animationLoop = null;
  let requestId = null;

  function onAnimationFrame(time, frame) {
    animationLoop(time, frame);

    requestId = context.requestAnimationFrame(onAnimationFrame);
  }

  return {
    start() {
      if (isAnimating === true) return;
      if (animationLoop === null) return;

      requestId = context.requestAnimationFrame(onAnimationFrame);

      isAnimating = true;
    },

    stop() {
      context.cancelAnimationFrame(requestId);

      isAnimating = false;
    },

    setAnimationLoop(callback) {
      animationLoop = callback;
    },

    setContext(value) {
      context = value;
    },
  };
}

export { WebGLAnimation };
