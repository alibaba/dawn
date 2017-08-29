---
group: service
name: server
title: 团队配置
---

# 团队配置

如果你在一个团队，并希望团队成员使用 dawn 时能有一些公共配置，或下发一些统一的构建规则，那么可以「搭建一个私有的中心服务」

Dawn 的私有服务端搭建成本「极低」，不需要下载任务服务端程序，只需要有一个支持静态文件的 Web Server 即可，如果没有，在 GitHub 或 GitLab 上，新建一个 repo 也行，只要能托管静态文件即可，当然你也可用基于动态服务搭建 dawn 中心服务

假如，你现在有一个 Web Server，并可能过 `http://your_server_url/<name>.yml` 访问，比如 

- http://your_server_url/template.yml
- http://your_server_url/middleware.yml
- http://your_server_url/pipe.yml
- http://your_server_url/rc.yml

### template.yml

template.yml 用于管理中心服务上的所有「推荐的模板列表」，用户在执行 `dn init` 时列出的模板列表，就是在 template.yml 配置的列表，格式如下

```yml
front: 
  location: 'dn-template-front'
  summary: 'Front Project Template'

node: 
  location: 'dn-template-node'
  summary: 'Node.js Project Template'
  
middleware: 
  location: 'dn-template-middleware'
  summary: 'Middleware Project Template'
```

顶层的 `key` 就是模板的名称，比如上边的 `front`、`node`，通过 `location` 指定模板对应的 npm 包名

location 还可以指定 scope 或 version，示例

```yml
front: 
  location: '@scope/dn-template-front'
  summary: 'Front Project Template'

node: 
  location: 'dn-template-node@1.0.0'
  summary: 'Node.js Project Template'

middleware: 
  location: '@scope/dn-template-middleware@1.0.0'
  summary: 'Middleware Project Template'
```

连接对应的 `server` 后，可以通过 `dn template [keyword]` 查询对应的模板

**注意**
所有不在中心服务 template 列表中的模板也可用于初始化工程，需要用 `-t` 或 `--template` 参数指定模板包名称，如下
```sh
$ dn init -t <package_name>
``` 

package_name 可以是完整的包名称，也可以不带默认前缀。

### middleware.yml

middleware.yml 用于管理「推荐的中间件列表」，格式如下

```yml
shell: 
  location: '@ali/dn-middleware-shell'
  summary: 可执行 shell 的中间件
```

配置格式及各字段和 template 一致，添加到 `middleware.yml` 中的「中件间」，在 dawn 连接到对应的 `serveer` 后，在配置 `pipe` 时，除了可以完整的包名、不带前缀的包名，也可以命名用配置的中的 `key` 如上边示例中的 `shell`。

连接对应的 `server` 后，可以通过 `dn middleware [keyword]` 查询对应的模板


### pipe.yml

pipe 是团队统一构建规则的核心，用户在连接某一个 `server` 后，在执行对应的命令时，会先合并「远程统一的 pipe 配置」，然后，再执行对应的的 pipeline，格式如下：

```yml
# 前置规则，会合并到工程本地配置的前边
before:
  test:
    - name: lint

# 后置规则，会合并到工程本地配置的后边
after:
  test:
    - name: shell
      script:
        - echo done
```
如上，中心 `pipe` 分为 `before` 和 `after` 两大部分，每部分和本地 `pipe` 格式一致，上边的示例，让强制让所有工程，在执行 `dn test` 时都会进行 `lint` 检查语法。

注意：如果本地配置中已有 `lint` 配置，不会重复执行。

### rc.yml

我们知道本地 `.dawnrc` 中支持三项配置 `server`、`registry`、`cacheTTL`，但是中心服务的 `rc.yml` 只支持 `registry`、`cacheTTL` 两项配置，并且是在本地 `.dawnrc` 没有指定任何值时才会有效，也就是说本地配置高于远程配置。
 