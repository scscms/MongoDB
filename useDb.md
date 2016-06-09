# MongoDB使用数据<sup>shine</sup>
###MongoDB基础知识
MongoDB非常强大但很容易上手。先介绍一些MongoDB的基本概念。

* 文档 是MongoDB中数据的基本单元，非常类似于关系型数据库管理系统中的行，但更具表现力。
* 类似地，集合 （collection）可以看作是一个拥有动态模式（dynamic schema）的表。
* MongoDB的一个实例可以拥有多个相互独立的数据库 （database），每一个数据库都拥有自己的集合。
* 每一个文档都有一个特殊的键"_id" ， 这个键在文档所属的集合中是唯一的。
* MongoDB自带了一个简单但功能强大的JavaScript shell ，可用于管理MongoDB的实例或数据操作。

MongoDB文档主键_id规则：
ObjectId 是 _id 的默认类型。

> ObjectId 采用12字节的存储空间，每个字节两位16进制数字，是一个24位的字符串。

12位生成规则：

[0,1,2,3] [4,5,6] [7,8] [9,10,11]

时间戳    |机器码 |PID  |计数器

* 前四位是时间戳，可以提供秒级别的唯一性。
* 接下来三位是所在主机的唯一标识符，通常是机器主机名的散列值。
* 接下来两位是产生ObjectId的PID，确保同一台机器上并发产生的ObjectId是唯一的。前九位保证了同一秒钟不同机器的不同进程产生的ObjectId时唯一的。
* 最后三位是自增计数器，确保相同进程同一秒钟产生的ObjectId是唯一的。 

### 1、浏览数据库
数据库名规则：

* 不能是空字符串（""）。
* 不得含有/、\、.、"、*、<、>、:、|、?、$（一个空格）、\0（空字符）。基本上，只能使用ASCII中的字母和数字。
* 数据库名区分大小写，即便是在不区分大小写的文件系统中也是如此。简单起见，数据库名应全部小写。
* 数据库名最多为64字节。
* admin、local、config等是数据库保留字符。

使用数据库前可以使用show dbs查看当前所有数据库：
```JavaScript
> show dbs
admin
local
```
然后可使用use xxx使用相应的数据库，注意数据库是区分大小写的。如：
```JavaScript
> use library
Switched to db library
```
这意味着以后所有操作将在library数据库中执行，同时注意如果你使用了一个不存在的数据库名，mongodb会自动新建它。所以要特别小心哦。
```JavaScript
> db //查询当前使用的数据库名
library
> show collections //查看当前数据库中的所有集合
system.indexes
```
### 2、在集合中插入数据
集合使用名称进行标识。集合名可以是满足下列条件的任意UTF-8字符串：

* $字符不能是键名的第一个字符。例如：$tags。
* 圆点不能出现在键名中，例如：ta.gs。原因是后面查询会冲突。
* 名称_id被保留用作主键，不推荐使用。
* 集合的名称不能超过128个字符。
* 空字符串（“”）不能被用作集合名称。
* 集合名称必须以字母或下划线开头。
* 集合名system被MongoDB保留，不能使用。
* 集合名不能包含null字符“\0”。

插入数据可以定义成变量，也可直接插入，在shell中可以使用换行符哦：
```JavaScript
> document = ({ "Type" : "Book",
...     "Title" : "Definitive Guide to MongoDB 2nd ed., The",
...     "ISBN" : "978-1-4302-5821-6",
...     "Publisher" : "Apress",
...     "Author" : ["Hows, David", "Plugge, Eelco", "Membrey, Peter","Hawkins, Tim"]
... })
{
        "Type" : "Book",
        "Title" : "Definitive Guide to MongoDB 2nd ed., The",
        "ISBN" : "978-1-4302-5821-6",
        "Publisher" : "Apress",
        "Author" : [
                "Hows, David",
                "Plugge, Eelco",
                "Membrey, Peter",
                "Hawkins, Tim"
        ]
}
>db.media.insert(document)
WriteResult({ "nInserted" : 1 })
```
回车的地方shell会自动添加三个点，只要语句没结束命令是不会执行的。同时回车后是不能按退格键删除分行，或移动光标到上一行，只能把命令写完。如果想要取消就连接三次回车或按Ctrl+c然后回车强制取消即可。
以下是不使用变量插入数据：
```JavaScript
>db.media.insert({ "Type" : "CD", "Artist" : "Nirvana", "Title" : "Nevermide" })
WriteResult({ "nInserted" : 1 })
```
####子集合
>组织集合的一种惯例是使用“.”分隔不同命名空间的子集合。例如，一个具有博客功能的应用可能包含两个集合，分别是blog.posts和blog.authors。这是为了使组织结构更清晰，这里的blog集合（这个集合甚至不需要存在）跟它的子集合没有任何关系。
虽然子集合没有任何特别的属性，但它们却非常有用，因而很多MongoDB工具都使用了子集合。
GridFS（一种用于存储大文件的协议）使用子集合来存储文件的元数据，这样就可以与文件内容块很好地隔离开来。
大多数驱动程序都提供了一些语法糖，用于访问指定集合的子集合。例如，在数据库shell中，db.blog 代表blog集合，而db.blog.posts 代表blog.posts集合。
在MongoDB中，使用子集合来组织数据非常高效，值得推荐。

### 3、查询数据
```JavaScript
>db.media.find() //返回所有数据
>db.media.find({ Type : "CD"}) //条件查询：返回Type = CD 的数据
>db.media.find({ Type : "CD"},{ Title : 1}) //返回内容过滤 只返回Title信息，如果{ Title : 0}
//意思是返回除Title以外的信息。（_id默认会返回）
>db.media.find({ "obj.title" : "something" }) //查询文档中内嵌信息，就是对象里面的属性值
```
使用函数sort、limit和skip
```JavaScript
>db.media.find().sort({ Title :1 }) //类似sql的ORDER BY语句，1表示按Title升序排序，-1是降序排序
>db.media.find().limit( 10 ) //限制只返回最多10个结果
>db.media.find().skip( 20 ) //忽略集合中前20个结果
>db.media.find().sort({ Title :1 }).limit( 10 ).skip( 20 ) //你说呢？
>db.media.find({},{ Title :1 }, 10 , 20 ) //效果与前一行一样。第一个{}是条件。
```
使用固定集合，自然顺序和$natural
```JavaScript
>db.createCollection("audit", { capped : true, size : 20480 }) //创建一个audit固定集合，大小不能超过20480字节。
>db.media.find().sort( { $natural: -1 } ).limit( 10 ) //保证自然顺序与插入顺序一致。
>db.createCollection("audit", { capped : true, size : 20480, max : 100 }) //max限制插入到固定集合中的文档数目。
{ "ok" : 1}
>db.audit.validate() //检查集合的大小

>db.media.findOne() //返回一个结果
>db.media.count() //统计返回文档的数目
>db.media.find({ Type : "Book" }).count()
>db.media.find({ Type : "Book" }).skip(2).count(true) //默认情况下count会忽略skip()或limit()参数
//为了保证结果准备可以添加count(true)确保查询不会忽略它们。
>db.media.distinct( "Title" ) //返回唯一值
```