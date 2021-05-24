let _context;

const AudioContext = {
  getContext() {
    if (_context === undefined) {
      _context = new (window.AudioContext || window.webkitAudioContext)();
    }

    return _context;
  },

  setContext(value) {
    _context = value;
  },
};

export { AudioContext };
