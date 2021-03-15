# dn-template-solution

## 简述

Solution 中间件是针对 Dawn 的单 Repo 多 Package 解决方案，通过 Solution 中间件可基于 Dawn 的基本命令在一个 Reop 中轻易管理多个 Packages。

## 使用

### 启用 solution 中间件

```yml
dev:
  - name: solution
build:
  - name: solution
test:
  - name: solution
add:
  - name: solution
link:
  - name: solution
publish:
  - name: solution
```

通过如上的配置，将 solution 工程（顶层的 Package）的所有 Pipeline 都交由 Solution 中间件负责。

### 在 Solution 中添加 Package

在 Solution 工程的根目录新建一个名称 `packages` 的目录（默认为 packages 但可指定为其他目录），然后，执行如下命令
```
dn add 
```

根据提示选择 'Create a new package'，可快速在 Solution 中创建一个 Package。当然也可手动在 packages 目录中创建新的 Package

### 配置 packages

在 .dawn 目录中新建一个 solution.yml 配置文件，在文件中添加如下配置

```yml
# 是否为统一模式（可省略，默认为 true）
unified: true

# packages 的根目录 (可省略，默认为 ./packages)
root: ./packages

# 声明所有 packages
packages:
  - name: your_package1
  - name: your_package2
  - name: your_package3
    deps:
      - your_package1
      - your_package2
```

如上示例，通过 packages 可声明 Solution 中有哪些 package，声明的顺序即「测试、构建、发布」等的顺序。

在声明完成后，执行如何命令完成 Package 间的依赖配置

```bash
dn run link
```

### 安装其他依赖

为所有或指定的 Pakcages 安装依赖时，也是使用 `dn add` 命令，如下

```bash
dn add
```

根据提示选择 `Install a remote package` 即可为全部或指定的 Packages 安装依赖的远程 npm package。

### 发布 Packages

如需发布能力，那么 solution 中的每个 package 都应该在 pipe 中配置 publish，当 unified 为 true 时，在执行 dn publish 时，会为每个 package 生成统一的版本，并全部发布。而当 unified 为 false 时，将仅依次执行每个 package 自已的 publish pipeline。

通常 package 的 publish 配置如下

```yml
publish:
  - name: call
    pipe:
      - test
      - build
  - name: publish 
```

然后，在 Solution 根目录，即可通过如下命令完成发布

```bash
dn publish
```

### 其他操作 

通常情况下，在 Solution 中和单工程的 Dawn 命令是一样，参考如下示例命令

```bash
# 执行测试
dn test

# 执行构建
dn build

# 启动本地开发
dn test
```
