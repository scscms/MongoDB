# MongoDB使用数据<sup>shine</sup>
###MongoDB基础知识
MongoDB非常强大但很容易上手。先介绍一些MongoDB的基本概念。

* 文档 是MongoDB中数据的基本单元，非常类似于关系型数据库管理系统中的行，但更具表现力。
* 类似地，集合 （collection）可以看作是一个拥有动态模式（dynamic schema）的表。
* MongoDB的一个实例可以拥有多个相互独立的数据库 （database），每一个数据库都拥有自己的集合。
* 每一个文档都有一个特殊的键"_id" ， 这个键在文档所属的集合中是唯一的。
* MongoDB自带了一个简单但功能强大的JavaScript shell ，可用于管理MongoDB的实例或数据操作。

MongoDB文档主键_id规则：

> ObjectId 采用12字节的存储空间，每个字节两位16进制数字，是一个24位的字符串。

12位生成规则：
[0,1,2,3] [4,5,6] [7,8] [9,10,11]
时间戳    |机器码 |PID  |计数器

* 前四位是时间戳，可以提供秒级别的唯一性。
* 接下来三位是所在主机的唯一标识符，通常是机器主机名的散列值。
* 接下来两位是产生ObjectId的PID，确保同一台机器上并发产生的ObjectId是唯一的。前九位保证了同一秒钟不同机器的不同进程产生的ObjectId时唯一的。
* 最后三位是自增计数器，确保相同进程同一秒钟产生的ObjectId是唯一的。 
例如：_id: 577bd74ef6aedf5019b320a1
####MongoDB 概念解析
|SQL术语/概念|MongoDB术语/概念|解释/说明|
|:----------:|:--------------:|:-------:|
|database    |database        |数据库   |
|table       |collection      |数据库表/集合|
|row         |document 	      |数据记录行/文档|
|column      |field 	      |数据字段/域|
|index 	index|索引            |都支持索引设置 |
|table joins |表连接,MongoDB不支持| |
|primary key |primary key     |主键,MongoDB自动将_id字段设置为主键|

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
将结果分组
group()类似SQL的GROUP BY其接受三个参数:
1.1 key 指定以哪个键来分组
2.2 initial 为分组提供基数（元素开始统计的起始基数）
3.3 reduce(items,prev) 遍历函数。此函数在分组后，分别在组内每个文档循环执行一次。
```JavaScript
db.media.group({
    key:{Type : true},
    initial : {Total : 0},
    reduce : function(items,prev){
     prev.Total += 13;
    }
})
```
### 使用条件操作符

* $or 或者，后接数组。
* $lt, $lte, $gt, $gte, $ne 等价于<, <=, >, >=, !=
* $in, $nin 等价于in, not in，后接数组
* $slice 截取结果
* $size 筛选属性数组内的元素数量
* $mod 取模运算
* $all $all和$in类似，但是他需要匹配数组内所有的值
* $exists 用来判断一个元素是否存在
* $elemMatch 限制各个属性必须在同一个对象内匹配
* $not 取反
* $type 基于bson type来匹配一个元素的类型，以下是对照表：

|代码  | 数据类型|
|:----:|-------|
| -1   | MiniKey |
|  1   | Double 双精度浮点值。用于存储浮点值|
|  2   | Character字符串(UTF-8),字符串 |
|  3   | 嵌入式对象,内嵌文档|
|  4   | 嵌入式数组,将数组或列表或多个值存储为一个键|
|  5   | 二进制数据 |
|  7   | 对象ID,用于创建文档的 ID|
|  8   | Boolean布尔值 |
|  9   | Date型,用UNIX时间格式来存储当前日期或时间|
| 10   | Null|
| 11   | Regular expression正则表达式 |
| 13   | Code存储 JavaScript 代码|
| 14   | Symbol符号|
| 15   | 带作用域的JavaScript代码|
| 16   | 32位整型|
| 17   | 时间截|
| 18   | 64位整型|
| 127  | MaxKey将一个值与 BSON元素的最高值相对比|
| 255  | MinKey将一个值与 BSON元素的最低值相对比|

例子参考 node_condition_find.js

### 4、更新数据

二、更新
mongodb更新有两个命令：

1).update()命令

db.collection.update( criteria, objNew, upsert, multi )

criteria : update的查询条件，类似sql update查询内where后面的
objNew   : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
upsert   : 这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。
multi    : mongodb默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。

例：
```JavaScript
db.test0.update( { "count" : { $gt : 1 } } , { $set : { "test2" : "OK"} } ); 只更新了第一条记录
db.test0.update( { "count" : { $gt : 3 } } , { $set : { "test2" : "OK"} },false,true ); 全更新了
db.test0.update( { "count" : { $gt : 4 } } , { $set : { "test5" : "OK"} },true,false ); 只加进去了第一条
db.test0.update( { "count" : { $gt : 5 } } , { $set : { "test5" : "OK"} },true,true ); 全加进去了
db.test0.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );全更新了
db.test0.update( { "count" : { $gt : 10 } } , { $inc : { "count" : 1} },false,false );只更新了第一条
```
2).save()命令

db.collection.save( x )
x就是要更新的对象，只能是单条记录。
如果在collection内已经存在一个和x对象相同的"_id"的记录。mongodb就会把x对象替换collection内已经存在的记录，否则将会插入x对象，如果x内没有_id,系统会自动生成一个再插入。相当于上面update语句的upsert=true,multi=false的情况。
例：
```JavaScript
db.test0.save({count:40,test1:"OK"}); #_id系统会生成
db.test0.save({_id:40,count:40,test1:"OK"}); #如果test0内有_id等于40的，会替换，否则插入。
```
mongodb的更新操作符：
1) $inc
用法：{ $inc : { field : value } }
意思对一个数字字段field增加value，例：
```JavaScript
db.test0.update( { "_id" : 15 } , { $inc : { "count" : 1 } } );//在本记录中count原有值再加1，等效于count+=1
```
2) $set
用法：{ $set : { field : value } }
就是相当于sql的set field = value，全部数据类型都支持$set例：
```JavaScript
> db.test0.update( { "_id" : 15 } , { $set : { "test1" : "testv1","test2" : "testv2","test3" : "testv3","test4" : "testv4" } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, "test1" : "testv1", "test2" : "testv2", "test3" : "testv3", "test4" : "testv4", "test5" : "OK" }
```
3) $unset
用法：{ $unset : { field : 1} }
顾名思义，就是删除字段了。例：
```JavaScript
db.test0.update( { "_id" : 15 } , { $unset : { "test2": 1 } } );//删除本记录的test2字段
```
4) $push
用法：{ $push : { field : value } }
把value追加到field里面去，field一定要是数组类型才行，如果field不存在，会新增一个数组类型加进去。例：
```JavaScript
db.test0.update( { "_id" : 15 } , { $set : { "test1" : ["aaa","bbb"] } } );
db.test0.update( { "_id" : 15 } , { $push : { "test1": "ccc" } } );//增加一个值到数组里
```
5) $pushAll
用法：{ $pushAll : { field : value_array } }
同$push,只是一次可以追加多个值到一个数组字段内。例：
```JavaScript
db.test0.update( { "_id" : 15 } , { $pushAll : { "test1": ["fff","ggg"] } } );//增加一个数组进去。等于数组合并效果
```
6)  $addToSet
用法：{ $addToSet : { field : value } }
增加一个值到数组内，而且只有当这个值不在数组内才增加。例：
```JavaScript
> db.test0.update( { "_id" : 15 } , { $addToSet : { "test1": {$each : ["444","555"] } } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18,  
  "test1" : ["aaa","bbb","ccc",["ddd","eee"],"fff","ggg",["111","222"],"444","555"], 
  "test2" : [ "ccc" ], "test4" : "testv4", "test5" : "OK"
 }
> db.test0.update( { "_id" : 15 } , { $addToSet : { "test1": {$each : ["444","555"] } } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, 
  "test1" : ["aaa","bbb","ccc",["ddd","eee"],"fff","ggg",["111","222"],"444","555"], "test2" : [ "ccc" ], 
  "test4" : "testv4", "test5" : "OK" 
}
> db.test0.update( { "_id" : 15 } , { $addToSet : { "test1": ["444","555"] } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, 
  "test1" : ["aaa","bbb","ccc",["ddd","eee"],"fff","ggg",["111","222"],"444","555",["444","555"]], "test2" : [ "ccc" ], 
  "test4" : "testv4", "test5" : "OK" 
}
> db.test0.update( { "_id" : 15 } , { $addToSet : { "test1": ["444","555"] } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, "test1" : ["aaa","bbb","ccc",["ddd","eee"],"fff","ggg",["111","222"],"444","555",["444","555"]], "test2" : [ "ccc" ], 
  "test4" : "testv4", "test5" : "OK" 
}
```
7) $pop
删除数组内的一个值
用法：删除最后一个值：{ $pop : { field : 1 } }删除第一个值：{ $pop : { field : -1 } }
注意，只能删除一个值，也就是说只能用1或-1，而不能用2或-2来删除两条。mongodb 1.1及以后的版本才可以用，例：
```JavaScript
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, 
  "test1" : ["bbb","ccc",["ddd","eee"],"fff","ggg",["111","222"],"444"], 
  "test2" : [ "ccc" ], "test4" : "testv4", "test5" : "OK" 
}
> db.test0.update( { "_id" : 15 } , { $pop : { "test1": -1 } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, 
  "test1" : ["ccc",["ddd","eee"],"fff","ggg",["111","222"],"444"], 
  "test2" : [ "ccc" ], "test4" : "testv4", "test5" : "OK"
 }
> db.test0.update( { "_id" : 15 } , { $pop : { "test1": 1 } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, 
  "test1" : [ "ccc", [ "ddd", "eee" ], "fff", "ggg", [ "111", "222" ] ], "test2" : [ "ccc" ], "test4" : "testv4",  "test5" : "OK" 
}
```
8) $pull
用法：$pull : { field : value } }
从数组field内删除一个等于value值。例：
```JavaScript
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, "test1" : [ "ccc", [ "ddd", "eee" ], "fff", "ggg", [ "111", "222" ] ], "test2" : [ "ccc" ], "test4" : "testv4","test5" : "OK" }

> db.test0.update( { "_id" : 15 } , { $pull : { "test1": "ggg" } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, "test1" : [ "ccc", [ "ddd", "eee" ], "fff", [ "111", "222" ] ], "test2" : [ "ccc" ], "test4" : "testv4", "test5": "OK" }
```

9) $pullAll
用法：{ $pullAll : { field : value_array } }
同$pull,可以一次删除数组内的多个值。例：
```JavaScript
>db.test0.find({ "_id" : 15 });
{ "_id" : { "floatApprox" : 15 }, "count" : 18, "test1" : [ "ccc", [ "ddd", "eee" ], "fff", [ "111", "222" ] ], "test2" : [ "ccc" ], "test4" : "testv4", "test5"
: "OK" }
> db.test0.update( { "_id" : 15 } , { $pullAll : { "test1": [ "ccc" , "fff" ] } } );
> db.test0.find( { "_id" : 15 } );
{ "_id" : { "floatApprox" : 15 }, "count" : 18, "test1" : [ [ "ddd", "eee" ], [ "111", "222" ] ], "test2" : [ "ccc" ], "test4" : "testv4", "test5" : "OK" }
```
10) $ 操作符
$是他自己的意思，代表按条件找出的数组里面某项他自己。呵呵，比较坳口。看一下官方的例子：
```JavaScript
> t.find()
{ "_id" : ObjectId("4b97e62bf1d8c7152c9ccb74"), "title" : "ABC", "comments" : [ { "by" : "joe", "votes" : 3 }, { "by" : "jane", "votes" : 7 } ] }
> t.update( {'comments.by':'joe'}, {$inc:{'comments.$.votes':1}}, false, true )
> t.find()
{ "_id" : ObjectId("4b97e62bf1d8c7152c9ccb74"), "title" : "ABC", "comments" : [ { "by" : "joe", "votes" : 4 }, { "by" : "jane", "votes" : 7 } ] }
```
需要注意的是，$只会应用找到的第一条数组项，后面的就不管了。还是看例子：
```JavaScript
> t.find();
{ "_id" : ObjectId("4b9e4a1fc583fa1c76198319"), "x" : [ 1, 2, 3, 2 ] }
> t.update({x: 2}, {$inc: {"x.$": 1}}, false, true);
```
还有注意的是$配合$unset使用的时候，会留下一个null的数组项，不过可以用{$pull:{x:null}}删除全部是null的数组项。例：
```JavaScript
> t.insert({x: [1,2,3,4,3,2,3,4]})
> t.find()
{ "_id" : ObjectId("4bde2ad3755d00000000710e"), "x" : [ 1, 2, 3, 4, 3, 2, 3, 4 ] }
> t.update({x:3}, {$unset:{"x.$":1}})
> t.find()
{ "_id" : ObjectId("4bde2ad3755d00000000710e"), "x" : [ 1, 2, null, 4, 3, 2, 3, 4 ] }
{ "_id" : ObjectId("4b9e4a1fc583fa1c76198319"), "x" : [ 1, 3, 3, 2 ] }
```
##### 以原子的方式修改和返回文档
findAndModify({query,sort,operations})
query:用于指定目标文件
sort:排序结果
operations:需要执行的操作
```JavaScript
> db.media.findAndModify({"Title" : "One Piece", sort:{"Title" : -1},remove:true}) //查找并删除，并返回本记录
> db.media.findAndModify({"Title" : "One Piece", sort:{"Title" : -1},updata :{$set: {"Title" : "new value"} } }) //查找并更新值，返回更新前的值
> db.media.findAndModify({"Title" : "One Piece", sort:{"Title" : -1},updata :{$set: {"Title" : "new value"} }, new:true }) //查找并更新值，并返回更新后的值
```
#### 重命名集合
```JavaScript
> db.media.renameCollection("newname")
{ "ok" : 1 }
```
#### 删除数据
```JavaScript
> db.media.remove({"Title" : "One Piece"}) //删除一条记录
> db.media.remove({}) //删除所有记录
> db.media.drop() //删除整个集合
> db.dropDatabase() //删除当前数据库
```
#### 引用数据库
```JavaScript
> book = db.media.findOne();
> db.other.findOne({ "Title" : book.title}) //1.手动引用数据
> db.other.findOne({ "Title" : [ new DBRef ('media',book.title)]}) //2.使用DBRef引用数据
```
### 5、使用索引相关的函数
创建索引是为了搜索更快
```JavaScript
> db.media.ensureIndex({ Title : 1}) //创建Title为升序索引  -1为降序索引
> db.media.ensureIndex({ "Tracklist.Title" : 1,"Tracklist.Length" : -1}) //创建多个子索引
> db.media.ensureIndex({ISBN : 1},{background : true}) //创建索引在后台完成
> db.media.find({ISBN : "978-1-432-512"}).hint({ISBN : 1}) //强制使用指定的索引
> db.media.find({ISBN : "978-1-432-512"}).hint({ISBN : 1}).explain() //确认是否使用了强制指定的索引
> db.media.find().min({ Released : 1995 }).max({ Released : 2005 }).hit({ Released : 1 }) //使用查询匹配   平时还是建议使用$gt，$lt因为它们不要求有索引
```

### 6、启用文本搜索
启动文本搜索有三种方式：
* 在启动命令添加选项
--setParameter textSearchEnabled=true
* 在MongoDB实例的配置文件中添加选项
setParameter=textSearchEnabled=true
* 使用Mongo shell命令
db.adminCommand({ setParameter : 1, textSearchEnabled : true })
假如我们在test表的media集合添加了一些数据，需要全文搜索的是Title
```JavaScript
>use test;
> //添加数据省略，或者使用mongimport导入数据
>db.adminCommand({ setParameter : 1, textSearchEnabled : true }); //文本索引已经启动
>db.media.ensureIndex({ Title : "text" }); //表示我们要对Title字段进行文本搜索
>db.media.getIndexes(); //可以先检查一下索引
>db.media.runCommand( "text", { search : "Toy" }); //开始搜索Title含有Toy关键字的集合
//应该可以看到结果
>db.media.runCommand( "text", { search : "Toy" ,filter : { Type: "DVD" } }); //条件过滤
>db.media.runCommand( "text", { search : "Toy DVD" }); //表示搜索Title = 'toy' or Title = 'DVD'
>db.media.runCommand( "text", { search : "Toy -DVD" }); //表示搜索Title = 'toy' and Title != 'DVD'
>db.media.runCommand( "text", { search : "\"Toy DVD\"" }); //表示搜索Title = 'toy DVD'
>db.media.runCommand( "text", { search : "Toy" , limit : 1 }); //限制返回1条数据
>db.media.runCommand( "text", { search : "Toy" , project:{ _id : 0,body : 1} }); //project设置返回的字段，0代表不显示，1代表显示
>db.media.runCommand( "text", { search : "Toy" , lagnuage:"english" }); //指定文本搜索所使用的语言
```
当前官网资料是V3版本，而我本地是V2.6.7。新版本开启文本搜索更方便了：
```JavaScript
>db.articles.insert(
    [
      { _id: 1, subject: "coffee", author: "xyz", views: 50 },
      { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
      { _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
      { _id: 4, subject: "baking", author: "xyz", views: 100 },
      { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
      { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
      { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
      { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
    ]
 ); //先插入一些数据
 >db.articles.createIndex( { subject: "text" } ); //开启subject字段为文本搜索
 >db.articles.find( { $text: { $search: "coffee" } } ); //搜索subject = "coffee"
 >db.articles.find( { $text: { $search: "bake coffee cake" } } ); //搜索subject = "bake" or subject = "coffee"  or subject = "cake"
 >db.articles.find( { $text: { $search: "\"coffee shop\"" } } ); //搜索subject = "coffee shop"
 >db.articles.find( { $text: { $search: "coffee -shop" } } ); //搜索subject = "coffee" and subject !="shop"
 >db.articles.find( { $text: { $search: "leche", $language: "es" } }  ); //指定搜索文本的语言，详细见网页说明
 >db.articles.find( { $text: { $search: "сы́рники CAFÉS" } } );//在版本3以前是查询不到结果的
 >db.articles.find( { $text: { $search: "Coffee", $caseSensitive: true } } );//在版本3.2新增是否区分大小写
 >db.articles.find( { $text: { $search: "CAFÉ", $diacriticSensitive: true } } );//在版本3.2新增是否区别敏感字符，类似ES6的
>db.articles.find({},{"subject":1,_id:0}).limit(1).skip(1); //查询所有数据，返回subject字段，隐藏_id(默认显示)只显示1条数据，跳过第1条（即只显示第2条数据）
>db.articles.find({"subject" : {$type : 2}}); //查询suject字段是字符串类型的数据。更多$type见上表
db.articles.find(
   { $text: { $search: "coffee" } },
   { score: { $meta: "textScore" } }
).sort( { score: { $meta: "textScore" } } ).limit(2); //新增一个搜索匹配度（精确）值，并按匹配度值排序后只返回2条记录
//搜索匹配度的意思是假如搜索的内容等于本字段那么匹配值为1，否则按占字符的百分比来计算，即是一个(0,1]的值。
```
[更详细的文本搜索介绍](https://docs.mongodb.com/manual/reference/operator/query/text/)
[文本搜索支持的语言](https://docs.mongodb.com/manual/reference/text-search-languages/#text-search-languages)

http://www.runoob.com/mongodb/mongodb-limit-skip.html