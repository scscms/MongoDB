# MongoDB使用数据<sup>shine</sup>
### 1、浏览数据库
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
回车的地方shell会自动添加三个点，只要语句没结束命令是不会执行的。同时回车后是不能按退格键删除分行，或移动光标到上一行，只能把命令写完。如果想要取消就按Ctrl+c然后按回车即可。
以下是不使用变量插入数据：
```JavaScript
>db.media.insert({ "Type" : "CD", "Artist" : "Nirvana", "Title" : "Nevermide" })
WriteResult({ "nInserted" : 1 })
```
插入文档键名规则：
1.$字符不能是键名的第一个字符。例如：$tags。
2.圆点不能出现在键名中，例如：ta.gs。原因是后面查询会冲突。
3.名称_id被保留用作主键，不推荐使用。
4.集合的名称不能超过128个字符。
5.空字符串（“”）不能被用作集合名称。
6.集合名称必须以字母或下划线开头。
7.集合名system被MongoDB保留，不能使用。
8.集合名不能包含null字符“\0”。
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