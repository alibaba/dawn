## dn-middleware-jcs

dn-middleware-jcs 是一个基于 JSX Control Statements 实现可通过 jsx 中通过标签语法写逻辑「控制」的中间件

## 开启

第一步，开启编译支持
```yml
dev:
  - name: jcs
  - name: webpack
    watch: true
  - name: server
  - name: browser-sync

build:
  - name: jcs
  - name: webpack
```

第二步，开启 lint 检查支持
```yml
test:
  - name: jcs
  - name: lint
  - name: unit
```

## 使用

开启后即可像如下示例中一样用标签写控制语句了

分支：
```jsx
<If condition={true}>
  <span>IfBlock</span>
</If>
```

循环：
```jsx
<For each="item" of={ this.props.items }>
  <span key={ item.id }>{ item.title }</span>
</For>
```

完整的用法请参考：
- https://zhuanlan.zhihu.com/p/28519304
- http://cnodejs.org/topic/5991e1c6bae6f2ed6f7e498a