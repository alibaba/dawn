import { css } from 'docz-plugin-css'

export default {
  title: '示例',
  description: '这是一个示例',
  plugins: [
    css({
      preprocessor: 'less',
      cssmodules: false,
    }),
  ],
}