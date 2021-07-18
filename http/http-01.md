# HTTP 01

### 主要内容

1. 网络模型简介
2. 三次握手和四次挥手
3. HTTP报文结构

## 网络模型

这里只介绍五层模型

```
---------------
|  应　用　层  |  上层应用只需要监听对应的端口，发送接收数据，我们最常接触的协议就是HTTP协议。处理的数据一般称为报文
---------------
|  运　输　层  |  为两台主机进程通信提供通用的数据传输服务，将报文根据不同的协议进行封装（TCP——报文段、UDP——用户数据报）
---------------
|  网　络　层  |  将上层数据封装为数据报，常用协议是IP协议。该层主要是确定传输路由与地址
---------------
|  数据链路层  |  将数据报封装成帧进行传输
---------------
|  物　理　层  |  传输二进制流，简单理解——网线
---------------
```

> 实际应用中是使用的四层模型：链路层 - 网络层 - 运输层 - 应用层
> 其中HTTPS会多一个安全层，在应用层和运输层之前，使用协议为TSL或者SSL

## 可靠连接的建立

### 三次握手

主要作用就是**双方都能明确自己和对方的收、发能力是正常的**

```
client          server
  |                |
  |-------SYN----->|  服务端能够知道客户端可以正常发送
  |                |
  |<----SYN+ACK----|  客户端能够知道服务端可以正常接收发送
  |                |
  |-------ACK----->|  服务端确认双方都正常
```

第一次握手只能让服务端知道**客户端能够正常发送**和**服务端能够正常接收**，但是客户端此时什么都不能确认
第二次握手只能让客户端知道**服务端能够正常发送接收**和**客户端能够正常接收发送**，但是此时服务端不知道自己的发送能力和客户端的接收能力是否正常
第三次握手后服务端才能确认双方都正常，可以进行可靠数据传输

### 四次挥手

```
client         server
  |               |
  |------FIN----->|
  |               |  这段时间服务端仍然能够发送数据
  |<-----ACK------|
  |               |
  |<-----FIN------|
  |               |
  |------ACK----->|
```

由客户端发送的`FIN`只是告诉服务端自己不再发送数据，如果服务端还要数据需要发送可以继续发送；由服务端发送的`FIN`是告诉客户端自己已经发送结束，可以安全关闭连接了

> 参考资料：https://zhuanlan.zhihu.com/p/53374516

## HTTP报文结构

分为三部分：
- `起始行`：请求报文的起始行说明了要做些什么；响应报文的起始行说明发生了什么
- `首部字段`：首部字段向请求和响应报文中添加了一些附加信息
- `主体`：可选。主要为HTTP要传输的内容

```
request
----------------------------------
|<method> <request-url> <version>|
----------------------------------
|<headers>                       |
----------------------------------
|<entity-body>                   |
----------------------------------

response
------------------------------------
|<version> <status> <reason-phrase>|
------------------------------------
|<headers>                         |
------------------------------------
|<entity-body>                     |
------------------------------------
```

> ##
> ### 如有错误，欢迎批评指正
> ##