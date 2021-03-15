---
group: guide
name: template
title: 制作模板
index: 2
---

# 制作一个模板

通常您应先看看是否已经存在满足您需求的模板，查看「推荐的模板」，可以通过如下命令：

```sh
$ dn template [keyword]
```

示例
```sh
dn template 
? Found 4 templates (Use arrow keys)
❯ 1. front      : Blank front end project template
  2. node       : Blank node project template
  3. middleware : Dawn middleware project template
  4. react      : Based on react-scripts, like create-react-app
```

通过「上下方向键」可以选择指定模板，然后「回车」可以查看对应模板的在线使用说明。


当您准备开发一个模板时，通常只需要通过已有的工程模板创建一个工程，然后在此基础上，调整 pipeline 配置，或调整目录结构，也可添加其它依赖，并在模板中添加各类文件示例。当然，也可以直接在一个空目录中创建一个全新的模板，每一个工程模板就是一个 npm 包，但是，要求必须命名为 `dn-template-xxx` ，然后，通过 `npm publish` 发布就行了。

### *.template 文件

如果一个模板中有 `*.template` 文件，在用此模板创建工程时，会被重命名，去掉 `.template` 后缀，重命名后的文件如有重名会被覆盖，比如，在模板中有两个文件`.dawn.yml` 和 `.dawn.yml.template` ，那么最终用这个模板创建的工程中的  `.dawn.yml` 的内容会和模板中的 `.dawn.yml.template` 一致。

#### 注意
通常模板中的 `.gitignore` 需要利用这个特性。模板在通过 npm 包发布后会丢失 `.gitignore`，如果希望你的模板创建的工程中有一个默认的 `.gitignore`，那么需要在模板中添加 `.gitignore.template` 

### 提交到推荐列表
如果希望将你的模板添加到「推荐模板列表」，请 fork [https://alibaba.github.io/dawn](https://alibaba.github.io/dawn) 后，编辑 `docs/template.yml`，然后，发起一个 Pull Request 就行了。