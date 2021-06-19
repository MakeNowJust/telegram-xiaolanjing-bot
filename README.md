## 小蓝鲸机器人

### 功能

- [x] 规则匹配
  - [x] 垃圾消息检测
- [x] DNS 查询
- [x] IP 地址查询
- [] Whois 查询
- [x] 化名聊天室
- [x] 更换语言
- [x] 生成二维码
- [] 进群验证

### 使用方法

#### 运行前

请填写 config.js 中的配置。

```bash
$ # 克隆仓库
$ git clone https://github.com/lihai2333/telegram-xiaolanjing-bot
$ # 进入仓库目录
$ cd telegram-xiaolanjing-bot/
$ # 安装依赖
$ npm install # or yarn install
$ # 安装 API Server 依赖
$ pip install -r requirements.txt
```

#### 运行

```bash
$ # 运行小蓝鲸
$ node index.js
$ # 运行 API Server
$ python api.py
```
