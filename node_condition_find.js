'use strict';
let mongodb = require('mongodb');
let server  = new mongodb.Server('www.scscms.com', 27017, {auto_reconnect:true});
let db = new mongodb.Db('test', server, {safe:true});
db.open(function(err, db){
    if(!err){
        console.log('connect successful');
        // 连接Collection适合标准集合
        // db.collection('media',{safe:true}, function(err, collection){
        // });
        // 显式创建边接适用固定集合
        db.createCollection('media', {safe:true}, function(err, collection){
            if(err){
                console.log(err);
            }else{
                let step = 18;//执行哪步
                switch (step){
                    case 0:
                        //插入一些数据
                        let dvd = {
                            'Type' : 'DVD',
                            'Title' : 'Matrix, The',
                            Released : 1999,
                            'Cast' : [
                                'Keanu Reeves',
                                'Carrie-Anne Moss',
                                'Laurence Fishburne',
                                'Hugo Weaving',
                                'Gloria Foster',
                                'Joe Pantoliano'
                            ]
                        };
                        collection.insert( dvd,{safe:true},(err, result) => {console.log(result)});
                        collection.insert({
                            'Type' : 'DVD',
                            'Title': 'Blade Runner',
                            'Released': 1982
                        },(err, result) => {console.log(result)});
                        collection.insert({
                            'Type' : 'DVD',
                            'Title': 'Toy Story 3',
                            'Released': 2010
                        },(err, result) => {console.log(result)});

                        console.log('=================insert collection===================');
                        break;
                    case 1:
                        //删除Collection
                        //collection.remove({},{safe:true},(err, result) => {
                        //    console.log(err ? err : result );
                        //});
                        collection.drop().then(ok => console.log(ok) ,err => console.log(err));
                        break;
                    case 2:
                        collection.find().toArray(function(err,docs){
                            console.log(docs);
                        });
                        break;
                    case 3:
                        collection.find({ Released : { $gt : 2000 }},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// 返回Released > 2000的结果，忽略Cast信息
                        });
                        break;
                    case 4:
                        collection.find({ Released : { $gte : 1999 }},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// Released >= 1999
                        });
                        break;
                    case 5:
                        collection.find({ Released : { $lt : 1999 }},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// Released < 1999
                        });
                        break;
                    case 6:
                        collection.find({ Released : { $lte : 1999 }},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// Released <= 1999
                        });
                        break;
                    case 7:
                        collection.find({ Released : { $gte : 1990,$lt : 2010 }},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// 1990 <= Released < 2010
                        });
                        break;
                    case 8:
                        collection.find({Type: 'DVD',Author : {$ne : 'Plugge, Eelco'}},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// Type = 'DVD' and Author != 'Plugge, Eelco'
                        });
                        break;
                    case 9:
                        collection.find({Released: {$in : [1999,2008,2009]}},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);// Released in [1999,2008,2009]
                            //同理 $nin 就是 not in
                        });
                        break;
                    case 10:
                        collection.find({Title: {$all : ['Toy','Story']}},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);//Title = 'Toy' and Title = 'Story'
                        });
                        break;
                    case 11:
                        collection.find({ $or : [{Title : 'Toy Story 3'},{Released : 1999}]},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);//Title = 'Toy Story 3' or Released = 1999
                        });
                        break;
                    case 12:
                        collection.find({ Title : 'Matrix, The'},{ 'Cast' : {$slice : 3}}).toArray(function(err,docs){
                            console.log(docs);//返回结果的前3项
                            //$slice : -3 返回结果的最后3项
                            //$slice : [2,5] 返回结果的第2至5项
                            //$slice : [-5,4] 忽略最后5项结果，并限制输出结果最多4项
                        });
                        break;
                    case 13:
                        collection.find({ Released:{ $mod: [2,0]}},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);//返回 Released % 2 == 0 即Released字段值为偶数的结果
                            //注意字段值必须是数字，同理$mod: [2,1] 是奇数
                        });
                        break;
                    case 14:
                        collection.find({ Cast:{ $size: 6}},{ 'Cast' : 1}).toArray(function(err,docs){
                            console.log(docs);//返回 Cast.length == 6
                        });
                        break;
                    case 15:
                        collection.find({ Title:{ $exists : true}}).toArray(function(err,docs){
                            console.log(docs);//返回 含有Title属性的集合
                            //$exists : false 不含有指定属性，$exists不能使用索引，需要全表扫描，有性能问题。
                        });
                        break;
                    case 16:
                        collection.find({ Cast:{ $type : 3}}).toArray(function(err,docs){
                            console.log(docs);//返回Cast属性是嵌入式对象
                            //更多$type值意思参看 useDb.md。
                        });
                        break;
                    case 17:
                        let _t1 = {
                            Test : [{
                                Name : "a",Title: "you"
                            },{
                                Name : "b",Title: "me"
                            }]
                        };
                        let _t2 = {
                            Test : [{
                                Name : "a",Title: "me"
                            },{
                                Name : "c",Title: "she"
                            }]
                        };
                        collection.insert( _t1,{safe:true});
                        collection.insert( _t2,{safe:true});
                        collection.find({ 'Test.Name' : 'a', 'Test.Title' : 'me'}).toArray(function(err,docs){
                            console.log(docs);//此结果将选中_t1,_t2,如果你希望以上条件必须在一个对象中符合就使用以下语句：
                        });

                        collection.find({ 'Test' : { $elemMatch : {'Name' : 'a', 'Title' : 'me'}}}).toArray(function(err,docs){
                            console.log(docs);//此时只会筛选到_t2文档
                        });

                        collection.find({ 'Test' : { $elemMatch : {$not:{'Name' : 'a', 'Title' : 'me'}}}}).toArray(function(err,docs){
                            console.log(docs);//再加一个$not取非结果，就会筛选到_t1文档了
                        });
                        break;
                    case 18:
                        collection.find({ Title:/Matrix*/i}).toArray(function(err,docs){
                            console.log(docs);//正则表达式
                        });
                        break;
                    default :
                }
            }
        });
    }else{
        console.log(err);
    }
});