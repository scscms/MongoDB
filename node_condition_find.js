'use strict';
let mongodb = require('mongodb');
let server  = new mongodb.Server('www.scscms.com', 27017, {auto_reconnect:true});
let db = new mongodb.Db('test', server, {safe:true});
db.open(function(err, db){
    if(!err){
        console.log('connect successful');
        // ����Collection�ʺϱ�׼����
        // db.collection('media',{safe:true}, function(err, collection){
        // });
        // ��ʽ�����߽����ù̶�����
        db.createCollection('media', {safe:true}, function(err, collection){
            if(err){
                console.log(err);
            }else{
                let step = 18;//ִ���Ĳ�
                switch (step){
                    case 0:
                        //����һЩ����
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
                        //ɾ��Collection
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
                            console.log(docs);// ����Released > 2000�Ľ��������Cast��Ϣ
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
                            //ͬ�� $nin ���� not in
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
                            console.log(docs);//���ؽ����ǰ3��
                            //$slice : -3 ���ؽ�������3��
                            //$slice : [2,5] ���ؽ���ĵ�2��5��
                            //$slice : [-5,4] �������5���������������������4��
                        });
                        break;
                    case 13:
                        collection.find({ Released:{ $mod: [2,0]}},{ 'Cast' : 0}).toArray(function(err,docs){
                            console.log(docs);//���� Released % 2 == 0 ��Released�ֶ�ֵΪż���Ľ��
                            //ע���ֶ�ֵ���������֣�ͬ��$mod: [2,1] ������
                        });
                        break;
                    case 14:
                        collection.find({ Cast:{ $size: 6}},{ 'Cast' : 1}).toArray(function(err,docs){
                            console.log(docs);//���� Cast.length == 6
                        });
                        break;
                    case 15:
                        collection.find({ Title:{ $exists : true}}).toArray(function(err,docs){
                            console.log(docs);//���� ����Title���Եļ���
                            //$exists : false ������ָ�����ԣ�$exists����ʹ����������Ҫȫ��ɨ�裬���������⡣
                        });
                        break;
                    case 16:
                        collection.find({ Cast:{ $type : 3}}).toArray(function(err,docs){
                            console.log(docs);//����Cast������Ƕ��ʽ����
                            //����$typeֵ��˼�ο� useDb.md��
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
                            console.log(docs);//�˽����ѡ��_t1,_t2,�����ϣ����������������һ�������з��Ͼ�ʹ��������䣺
                        });

                        collection.find({ 'Test' : { $elemMatch : {'Name' : 'a', 'Title' : 'me'}}}).toArray(function(err,docs){
                            console.log(docs);//��ʱֻ��ɸѡ��_t2�ĵ�
                        });

                        collection.find({ 'Test' : { $elemMatch : {$not:{'Name' : 'a', 'Title' : 'me'}}}}).toArray(function(err,docs){
                            console.log(docs);//�ټ�һ��$notȡ�ǽ�����ͻ�ɸѡ��_t1�ĵ���
                        });
                        break;
                    case 18:
                        collection.find({ Title:/Matrix*/i}).toArray(function(err,docs){
                            console.log(docs);//������ʽ
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