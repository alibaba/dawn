import * as MathUtils from './MathUtils.js';

const _colorKeywords = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32,
};

const _hslA = { h: 0, s: 0, l: 0 };
const _hslB = { h: 0, s: 0, l: 0 };

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
  return p;
}

function SRGBToLinear(c) {
  return c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
}

function LinearToSRGB(c) {
  return c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
}

class Color {
  constructor(r, g, b) {
    if (g === undefined && b === undefined) {
      // r is THREE.Color, hex or string
      return this.set(r);
    }

    return this.setRGB(r, g, b);
  }

  set(value) {
    if (value && value.isColor) {
      this.copy(value);
    } else if (typeof value === 'number') {
      this.setHex(value);
    } else if (typeof value === 'string') {
      this.setStyle(value);
    }

    return this;
  }

  setScalar(scalar) {
    this.r = scalar;
    this.g = scalar;
    this.b = scalar;

    return this;
  }

  setHex(hex) {
    hex = Math.floor(hex);

    this.r = ((hex >> 16) & 255) / 255;
    this.g = ((hex >> 8) & 255) / 255;
    this.b = (hex & 255) / 255;

    return this;
  }

  setRGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;

    return this;
  }

  setHSL(h, s, l) {
    // h,s,l ranges are in 0.0 - 1.0
    h = MathUtils.euclideanModulo(h, 1);
    s = MathUtils.clamp(s, 0, 1);
    l = MathUtils.clamp(l, 0, 1);

    if (s === 0) {
      this.r = this.g = this.b = l;
    } else {
      const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
      const q = 2 * l - p;

      this.r = hue2rgb(q, p, h + 1 / 3);
      this.g = hue2rgb(q, p, h);
      this.b = hue2rgb(q, p, h - 1 / 3);
    }

    return this;
  }

  setStyle(style) {
    function handleAlpha(string) {
      if (string === undefined) return;

      if (parseFloat(string) < 1) {
        console.warn(`THREE.Color: Alpha component of ${style} will be ignored.`);
      }
    }

    let m;

    if ((m = /^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(style))) {
      // rgb / hsl

      let color;
      const name = m[1];
      const components = m[2];

      switch (name) {
        case 'rgb':
        case 'rgba':
          if ((color = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components))) {
            // rgb(255,0,0) rgba(255,0,0,0.5)
            this.r = Math.min(255, parseInt(color[1], 10)) / 255;
            this.g = Math.min(255, parseInt(color[2], 10)) / 255;
            this.b = Math.min(255, parseInt(color[3], 10)) / 255;

            handleAlpha(color[4]);

            return this;
          }

          if ((color = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components))) {
            // rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
            this.r = Math.min(100, parseInt(color[1], 10)) / 100;
            this.g = Math.min(100, parseInt(color[2], 10)) / 100;
            this.b = Math.min(100, parseInt(color[3], 10)) / 100;

            handleAlpha(color[4]);

            return this;
          }

          break;

        case 'hsl':
        case 'hsla':
          if ((color = /^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(components))) {
            // hsl(120,50%,50%) hsla(120,50%,50%,0.5)
            const h = parseFloat(color[1]) / 360;
            const s = parseInt(color[2], 10) / 100;
            const l = parseInt(color[3], 10) / 100;

            handleAlpha(color[4]);

            return this.setHSL(h, s, l);
          }

          break;
      }
    } else if ((m = /^\#([A-Fa-f\d]+)$/.exec(style))) {
      // hex color

      const hex = m[1];
      const size = hex.length;

      if (size === 3) {
        // #ff0
        this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
        this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
        this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;

        return this;
      } else if (size === 6) {
        // #ff0000
        this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255;
        this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255;
        this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255;

        return this;
      }
    }

    if (style && style.length > 0) {
      return this.setColorName(style);
    }

    return this;
  }

  setColorName(style) {
    // color keywords
    const hex = _colorKeywords[style.toLowerCase()];

    if (hex !== undefined) {
      // red
      this.setHex(hex);
    } else {
      // unknown color
      console.warn(`THREE.Color: Unknown color ${style}`);
    }

    return this;
  }

  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }

  copy(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;

    return this;
  }

  copyGammaToLinear(color, gammaFactor = 2.0) {
    this.r = Math.pow(color.r, gammaFactor);
    this.g = Math.pow(color.g, gammaFactor);
    this.b = Math.pow(color.b, gammaFactor);

    return this;
  }

  copyLinearToGamma(color, gammaFactor = 2.0) {
    const safeInverse = gammaFactor > 0 ? 1.0 / gammaFactor : 1.0;

    this.r = Math.pow(color.r, safeInverse);
    this.g = Math.pow(color.g, safeInverse);
    this.b = Math.pow(color.b, safeInverse);

    return this;
  }

  convertGammaToLinear(gammaFactor) {
    this.copyGammaToLinear(this, gammaFactor);

    return this;
  }

  convertLinearToGamma(gammaFactor) {
    this.copyLinearToGamma(this, gammaFactor);

    return this;
  }

  copySRGBToLinear(color) {
    this.r = SRGBToLinear(color.r);
    this.g = SRGBToLinear(color.g);
    this.b = SRGBToLinear(color.b);

    return this;
  }

  copyLinearToSRGB(color) {
    this.r = LinearToSRGB(color.r);
    this.g = LinearToSRGB(color.g);
    this.b = LinearToSRGB(color.b);

    return this;
  }

  convertSRGBToLinear() {
    this.copySRGBToLinear(this);

    return this;
  }

  convertLinearToSRGB() {
    this.copyLinearToSRGB(this);

    return this;
  }

  getHex() {
    return ((this.r * 255) << 16) ^ ((this.g * 255) << 8) ^ ((this.b * 255) << 0);
  }

  getHexString() {
    return `000000${this.getHex().toString(16)}`.slice(-6);
  }

  getHSL(target) {
    // h,s,l ranges are in 0.0 - 1.0

    if (target === undefined) {
      console.warn('THREE.Color: .getHSL() target is now required');
      target = { h: 0, s: 0, l: 0 };
    }

    const r = this.r;
    const g = this.g;
    const b = this.b;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let hue;
    let saturation;
    const lightness = (min + max) / 2.0;

    if (min === max) {
      hue = 0;
      saturation = 0;
    } else {
      const delta = max - min;

      saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / delta + 2;
          break;
        case b:
          hue = (r - g) / delta + 4;
          break;
      }

      hue /= 6;
    }

    target.h = hue;
    target.s = saturation;
    target.l = lightness;

    return target;
  }

  getStyle() {
    return `rgb(${(this.r * 255) | 0},${(this.g * 255) | 0},${(this.b * 255) | 0})`;
  }

  offsetHSL(h, s, l) {
    this.getHSL(_hslA);

    _hslA.h += h;
    _hslA.s += s;
    _hslA.l += l;

    this.setHSL(_hslA.h, _hslA.s, _hslA.l);

    return this;
  }

  add(color) {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;

    return this;
  }

  addColors(color1, color2) {
    this.r = color1.r + color2.r;
    this.g = color1.g + color2.g;
    this.b = color1.b + color2.b;

    return this;
  }

  addScalar(s) {
    this.r += s;
    this.g += s;
    this.b += s;

    return this;
  }

  sub(color) {
    this.r = Math.max(0, this.r - color.r);
    this.g = Math.max(0, this.g - color.g);
    this.b = Math.max(0, this.b - color.b);

    return this;
  }

  multiply(color) {
    this.r *= color.r;
    this.g *= color.g;
    this.b *= color.b;

    return this;
  }

  multiplyScalar(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;

    return this;
  }

  lerp(color, alpha) {
    this.r += (color.r - this.r) * alpha;
    this.g += (color.g - this.g) * alpha;
    this.b += (color.b - this.b) * alpha;

    return this;
  }

  lerpColors(color1, color2, alpha) {
    this.r = color1.r + (color2.r - color1.r) * alpha;
    this.g = color1.g + (color2.g - color1.g) * alpha;
    this.b = color1.b + (color2.b - color1.b) * alpha;

    return this;
  }

  lerpHSL(color, alpha) {
    this.getHSL(_hslA);
    color.getHSL(_hslB);

    const h = MathUtils.lerp(_hslA.h, _hslB.h, alpha);
    const s = MathUtils.lerp(_hslA.s, _hslB.s, alpha);
    const l = MathUtils.lerp(_hslA.l, _hslB.l, alpha);

    this.setHSL(h, s, l);

    return this;
  }

  equals(c) {
    return c.r === this.r && c.g === this.g && c.b === this.b;
  }

  fromArray(array, offset = 0) {
    this.r = array[offset];
    this.g = array[offset + 1];
    this.b = array[offset + 2];

    return this;
  }

  toArray(array = [], offset = 0) {
    array[offset] = this.r;
    array[offset + 1] = this.g;
    array[offset + 2] = this.b;

    return array;
  }

  fromBufferAttribute(attribute, index) {
    this.r = attribute.getX(index);
    this.g = attribute.getY(index);
    this.b = attribute.getZ(index);

    if (attribute.normalized === true) {
      // assuming Uint8Array

      this.r /= 255;
      this.g /= 255;
      this.b /= 255;
    }

    return this;
  }

  toJSON() {
    return this.getHex();
  }
}

Color.NAMES = _colorKeywords;

Color.prototype.isColor = true;
Color.prototype.r = 1;
Color.prototype.g = 1;
Color.prototype.b = 1;

export { Color };
