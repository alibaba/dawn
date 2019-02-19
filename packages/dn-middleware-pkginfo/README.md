# pkginfo 中间件

支持静默模式，读取并使用环境变量中的值：
```bash
# encodeURIComponent(JSON.stringify({ pkginfo: { name: 'info', version: '1.2.3', silence: true } }))
# => "%7B%22pkginfo%22%3A%7B%22name%22%3A%22info%22%2C%22version%22%3A%221.2.3%22%2C%22silence%22%3Atrue%7D%7D"
DN_ARGV="%7B%22pkginfo%22%3A%7B%22name%22%3A%22info%22%2C%22version%22%3A%221.2.3%22%2C%22silence%22%3Atrue%7D%7D" dn init

--------

[14:17:25] 设定项目信息...
[14:17:25] 静默模式... {"name":"info","version":"1.2.3","silence":true}
[14:17:25] 完成
```