
# MVP功能
1. 在`行情`界面展示Binance, OKX 现货与期货价格与基差
2. 在`我的`界面展示用户基本信息，以及绑定Binance,OKX API 功能
3. 在`交易`界面提供自动下单配置机器人，配置机器人自动捕捉交易机会，自动完成套利交易全过程.


### todolist
- 认证功能 ( 客户端 通过REST API 认证后，再通过Websocket发送 `auth` 消息，payload 是 `token`, 后端再将 用户id与socketid绑定)
