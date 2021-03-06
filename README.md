# MongoDB<sup>shine</sup>
### 简介
MongoDB是当下流行的非关系型数据库。MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
本人首先在家里尝试win7 64位旗舰版下安装，每次执行都提示“mongod.exe　已停止工作”。而在办公室同样是win7　64位但家庭版下，一次就顺利安装成功。

### 安装之前
注意：从mongodb 2.2开始不再支持Windows XP,所以本文只适合于XP以后的Vista、Windows7或之后的版本。所以安装之前我们需要安装一下HotFix 内存补丁。
本文旁边就有其压缩文件`451413_intl_x64_zip.exe`，双击文件，点击continue会将补丁解压到你指定的路径，在你指定的路径下会生成Windows6.1-KB2731284-v3-x64.msu 安装文件，双击该文件。
![image](https://github.com/scscms/MongoDB/raw/master/images/0.jpg)<br/>
点击 “是(Y)”。安装后需要重启Windows。
然后确定自己的系统是多少位操作系统，可在cmd执行脚本判断：
```JavaScript
>wmic os get osarchitecture
```
假设为64位操作系统则应下载含有64字样的包，如mongodb-win32-x86_64-2008plus-ssl-3.2.6-signed.msi
### 下载安装
1.首先上[官网下载](https://www.mongodb.com/download-center#community)相应的版本，本人使用的是mongodb-win32-x86_64-2008plus-ssl-3.2.6-signed.msi。下载后点击安装，如下图所示：<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/1.jpg)<br/>
2.点击“Next”进行下一步：<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/2.jpg)<br/>
3.同意许可，点击“Next”进行下一步：<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/3.jpg)<br/>
4.在此时你可选择“complete”全自动安装，而我想修改默认安装目录，所以选择“Custom”，并下一步：<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/4.jpg)<br/>
5.点击“Browse...”:<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/5.jpg)<br/>
6.然后在Folder name:里把安装目录改为“C:\MongoDB\Server\3.2\”，并点“ok”:<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/6.jpg)<br/>
7.点击“Install”:<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/7.jpg)<br/>
8.喝口茶或吃口烟...<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/8.jpg)<br/>
7.点击“Finish”,完成安装。
8.打开路径C:\MongoDB\Server\3.2，里面默认有个bin文件夹，然后旁边新建一个data文件夹，在data文件夹里再新建db和log文件夹。
然后以管理员身份执行命令提示符（打开附件找到cmd程序右键并选择`以管理员身份运行`），cd到C:\MongoDB\Server\3.2\bin目录下，执行以下命令：
```JavaScript
>mongod.exe --dbpath "C:\mongodb\data\db" --logpath "C:\mongodb\data\log\MongoDB.log" --install --serviceName "MongoDB"
```
这里MongoDB.log就是开启日志文件，--serviceName "MongoDB"意思是将服务名为MongoDB。运行命令成功如下图所示：
![image](https://github.com/scscms/MongoDB/raw/master/images/10.jpg)<br/>
图中同时测试了(开启服务）和(关闭服务)命令：
```JavaScript
>NET START MongoDB
>NET stop MongoDB
```
更多命令查阅：
```JavaScript
>mongod.exe --help
```
9.最后让我们测试一下数据库吧。打开C:\MongoDB\Server\3.2\bin。先双击mongod.exe程序，它会闪一下退出。然后双击mongo.exe程序，输入以下脚本进行测试：
```JavaScript
>db.foo.insert({a:"scscms"})
>db.foo.find()
```

最后卸载MongodDB，可先删除服务，cd到C:\MongoDB\Server\3.2\bin目录下
```JavaScript
>net stop MongoDB
>mongod.exe --remove --serviceName "MongoDB"
```
然后执行安装文件，选择Remove<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/9.jpg)

### 安装mongdb图形化管理工具
这个不是必备之选。使用之前下载的Robomongo-0.8.4-i386.exe图形化工具，双击运行 Robomongo-0.8.4-i386.exe
![image](https://github.com/scscms/MongoDB/raw/master/images/r1.jpg)
![image](https://github.com/scscms/MongoDB/raw/master/images/r2.jpg)
![image](https://github.com/scscms/MongoDB/raw/master/images/r3.jpg)
![image](https://github.com/scscms/MongoDB/raw/master/images/r4.jpg)
![image](https://github.com/scscms/MongoDB/raw/master/images/r5.jpg)<br/>
点击Create,如果只连接本地的mongodb，我们只把name改成“本地”，其他什么都不用做，save即可。如果你点击Test按钮，你可能看到一个类似这样的错误“Authorization skipped by you”。请忽略这个错误。<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/r6.jpg)<br/>
点击connect,连接成功后。我们在test数据库上右键“Open Shell”并输入db.foo.find()然后点击绿色运行的三角形图标结果就出来了。<br/>
![image](https://github.com/scscms/MongoDB/raw/master/images/r7.jpg)<br/>
<!--简单的给mongodb添加用户和认证http://www.cnblogs.com/guizi/archive/2012/11/20/2779500.html-->

### window上安装 MongoDB PHP扩展
Github上已经提供了用于window平台的预编译php mongodb驱动二进制包\([下载地址 https://s3.amazonaws.com/drivers.mongodb.org/php/index.html](https://s3.amazonaws.com/drivers.mongodb.org/php/index.html)\)，你可以下载与你php对应的版本，但是你需要注意以下几点问题：

    VC6 是运行于 Apache 服务器
    'Thread safe'（线程安全）是运行在Apache上以模块的PHP上，如果你以CGI的模式运行PHP，请选择非线程安全模式（' non-thread safe'）。
    VC9是运行于 IIS 服务器上。
    下载完你需要的二进制包后，解压压缩包，将'php_mongo.dll'文件添加到你的PHP扩展目录中（ext）。ext目录通常在PHP安装目录下的ext目录。

打开php配置文件 php.ini 添加以下配置：
```JavaScript
extension=php_mongo.dll
```
重启IIS服务器。

## MongoDB 管理工具: Rockmongo

RockMongo是PHP5写的一个MongoDB管理工具。
通过 Rockmongo 你可以管理 MongoDB服务，数据库，集合，文档，索引等等。
它提供了非常人性化的操作。类似 phpMyAdmin（PHP开发的MySql管理工具）。
Rockmongo 下载地址：[http://rockmongo.com/downloads][Rockmongo]

[Rockmongo]:http://rockmongo.com/downloads  "Rockmongo 下载地址"