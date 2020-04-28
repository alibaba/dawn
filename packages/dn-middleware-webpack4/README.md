## 背景
原先dawn体系里只有低版本webpack的中间件，无法很好利用webpack4很多高级特性，本次我们支持了webpack4，几乎完全向下兼容，即使是旧项目迁移，成本也很低，并且增加了很多开发中新功能：
1. 热更新支持
2. typescript集成
3. eslint开发中集成
4. 更好的诊断功能
5. 更好的bundle拆分，treeshaking支持等等

## 配置项大全


```yaml
- name: '@ali/webpack4'
	# ----------------------------------// 以下为webpack4构建器专属的配置项，为新增功能
  useSass: true // default true 启用sass编译，确认项目中不需要sass的话可以设为false，sass相关的依赖便不会安装
  useEslint: false // default falst 开发环境启用eslint
  treeShakingLevel: null // default null , 1为开启所有webpack默认的tree-shaking,2则为安全的只开启ant和fusion的tree-shaking
  supportTS: false // 配置为true时支持对ts的编译，此时可以移除dn-middleware-typescript（此中间件webpack4不兼容）
  useStyleLoader: false // 默认false 开发环境启用styleLoader支持热加载
  env: development // 必须传入，开发环境development, 生产环境production
  disableMulti: false // default false 设为true时，取消默认的对于多页面应用的选择性构建
  analysis: false // default false, 设为true时，可以开启bundle size和loader解析时长插件，帮助分析项目瓶颈
  chunkFilename: 'chunks/[name].js' // 默认异步chunk为这个路径，可根据vm中升级前的路径灵活变更
  compress: false //default false, 是否开启webpack高性能压缩，如开启，切记不要再使用dn-middleware-compress
  -------------------------------------// 以下为兼容的webpack原先版本的配置，100%原先的配置都可用
 	entry: ./src/*.js               # 将 src 下所有 .js 文件作为入口（不包括子目录中的 js,）
  watch: true/false               # 是否开启监听模式
  publicPath: 										#	异步资源默认前缀，如cdn地址
  sourceMap: true/false             # 是否开启sourcemap
 	template: ./src/assets/*.html   # 将 assest 下的所有 html 作为页面模板,默认为src下的assets
  external: true                  # 此为排除库文件的开关，当为true时，下方的配置才生效
 	externals:                      # 声明排除的库文件，将不会打入 chunks 中
  jquery: jQuery 
  babel: 													# 可查看babel文档，透传babel配置项，目前为babel6，后续会升级babel7
  	presets: []
    plugins: []
    include: 
    exclude:
    loose:
    modules:
    useBuiltIns: 
  common:
    disabled: true                # 禁用抽取公共部分
    name: 'common'                # 生成的公共资源名称
  cssModules: true                # 是否启用 css modules 方案,
  folders:                        # 指定资源子目录名称，主要包括css,js，字体和图片和html的目录
    js: js
    css: css
    font: font
    img: img
    html: html
```

## 低版本升级
```bash
npm uninstall dn-middleware-webpack dn-middleware-webpack@next && npm i @ali/dn-middleware-webpack4 -D
```

最好按此过程来一下，主要是为了更新本地的pack-lock.json
