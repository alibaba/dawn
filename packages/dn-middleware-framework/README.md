---
group: template
name: middleware-ts
title: 中间件模板（TS版）
---

## dn-middleware-framework

* `echo ".runtime" >> .gitignore`
* `tsconfig.json paths`:

```json
"paths": {
  "@/*": ["src/*"],
  "dawn": ["./src/.runtime"],
  "dawn/*": ["./src/.runtime/*"],
  "@@/*": ["src/.runtime/*"]
}
```
