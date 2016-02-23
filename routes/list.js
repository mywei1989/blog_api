var async = require('async');
var settings = require('../settings/settings.js');
var Post = require('../models/post.js');
var List = require('../models/list.js');



module.exports = function(app){

  app.get('/getAllTag',function(req,res,next){
    if(req.sessionID){
      var post = new Post({});
      post.getAllTag(function(err,docs){
        if(!(err)&&docs!=null){
          res.json(docs);
          res.end();
        }else{
          res.json({status:404,message:''});
          res.end();
        }
      });
    }else{
      res.end();
    }
  });

  app.get('/getArchive',function(req,res,next){
    if(req.sessionID){
      var list = new List({
        pageIndex:1,
        pageSize:settings.pageSize,
        queryObj:{}
      });
      list.getArchive(function(err,archiveArray){
        if(!(err)&&archiveArray){
          res.json(archiveArray);
          res.end();
        }else{
          res.json({status:404,message:''});
          res.end();
        }
      });
    }else{
      res.end();
    }
  });


  app.get('/',function(req,res,next){
    if(req.sessionID){
      var list = new List({
        pageIndex:1,
        pageSize:settings.pageSize,
        queryObj:{}
      });
      var post = new Post({});
      async.parallel({
        getPageCount:function(done){
          list.getCount(function(err,count){
            if(!(err)&&(count!=0)){
              done(null,Math.ceil(count/settings.pageSize));
            }else{
              done(null);
            }
          });
        },
        getList:function(done){
          list.getList(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }else{
              done(null);
            }
          });
        }
      },function(asyncErr,asyncResult){
        if(!asyncErr){
          res.json({
            list:asyncResult.getList,
            pagination:{
              pageIndex:1,
              pageCount:asyncResult.getPageCount
            }
          });
        }else{
          //404
          res.end();
        }
      });
    }
  });

  app.get('/tag/:tag',function(req,res,next){
    res.redirect(301,'/tag/'+req.params.tag+'/');
  });

  app.get('/tag/:tag/',function(req,res,next){
    if(req.sessionID){
      var list = new List({
        pageIndex:1,
        pageSize:settings.pageSize,
        queryObj:{"tags":{$elemMatch:{"tag":req.params.tag}}}
      });
      var post = new Post({});
      async.parallel({
        getPageCount:function(done){
          list.getCount(function(err,count){
            if(!(err)&&(count!=0)){
              done(null,Math.ceil(count/settings.pageSize));
            }else{
              done(null);
            }
          });
        },
        getList:function(done){
          list.getList(function(err,docs){
            if(!(err)&&docs){
              done(null,docs);
            }else{
              done(null);
            }
          });
        }
      },function(asyncErr,asyncResult){
        if(!asyncErr){
          res.json({
            list:asyncResult.getList,
            pagination:{
              prefix:"/tag/"+req.params.tag,
              pageIndex:1,
              pageCount:asyncResult.getPageCount
            }
          });
        }else{
          //404
          res.end();
        }
      });
    }
  });
}