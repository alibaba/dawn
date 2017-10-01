---
group: service
name: client
title: 用户配置
---

# 用户配置

Dawn 目前主要有三个配置项：

- `server` : 要连接的中心服务，默认连接公共服务，也可以连接「私有中心服务」
- `registry` : npm 源，默认连接 npm 官方源
- `cacheTTL` : 缓存时长，设定远程配置的最大缓存时长

### 通过命令更改配置

```sh
$ dn config [name] [value]
```

当省略 `name` 时会让用户先选择配置项的「名称」，然后，再让用户选择或输入「值」。当省略 `value` 时，会让用户在「默认值、历史、输入值」中选择。

#### 示例一：

```sh
$ dn config server http://your_server_url
```

上边的示例，将会新「中心服务」更改为 `your_server_url`

#### 示例二：

```
$ dn config server
```
将会有如下提示

```sh
? Please enter or select configuration value (Use arrow keys)
❯ Enter a new configuration value
  default : http://default_url/${name}.yml
```

会提示用户输入一个新的 URL 或选择默认的 URL，当选择输入或输入空时，将会使用默认 server 配置

### 通过 .dawnrc 更改配置

除了命令方式也可以手动编辑 `~/.dawnrc` 文件更改配置

#### 示例
```sh
$ vim ~/.dawnrc
``` 

.dawnrc 格式如下

```yml
server: your_server_url
registry: your_registry_url
cacheTTL: your_ttl
```