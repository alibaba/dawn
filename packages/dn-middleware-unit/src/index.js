import path from 'path';

export default function resolve(from, to) {
  let el = document.createElement('div');
  return path.resolve(from, to);
}