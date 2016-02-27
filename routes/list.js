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
  app.get('/page',function(req,res,next){
    res.redirect(301,'/page/1/');
  });
  app.get('/page/:page',function(req,res,next){
    res.redirect(301,'/page/'+req.params.page+'/');
  });
  app.get('/page/:page/',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params.page;
      var list = new List({
        pageIndex:pageIndex,
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
              pageIndex:parseInt(pageIndex),
              pageCount:parseInt(asyncResult.getPageCount)
            }
          });
        }else{
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

  app.get('/tag/:tag/page/:page',function(req,res,next){
    res.redirect(301,'/tag/'+req.params.tag+'/page/'+req.params.page+'/');
  });

  app.get('/tag/:tag/page/:page/',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params.page;
      var list = new List({
        pageIndex:pageIndex,
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
              pageIndex:parseInt(pageIndex),
              pageCount:parseInt(asyncResult.getPageCount)
            }
          });
        }else{
          //404
          res.end();
        }
      });
    }
  });

  app.get('/:year/:month',function(req,res,next){
    res.redirect(301,'/'+req.params.year+'/'+req.params.month+'/');
  });
  app.get('/:year/:month/',function(req,res,next){
    if(req.sessionID){
      var list = new List({
        pageIndex:1,
        pageSize:settings.pageSize,
        queryObj:{"time.monthQuery":req.params.year+"-"+req.params.month}
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
              prefix:"/"+req.params.year+"/"+req.params.month,
              pageIndex:1,
              pageCount:parseInt(asyncResult.getPageCount)
            }
          });
        }else{
          res.end();
        }
      });
    }
  });
  app.get('/:year/:month/page',function(req,res,next){
    res.redirect(301,'/'+req.params.year+'/'+req.params.month+'/page/1/');
  });
  app.get('/:year/:month/page/:page',function(req,res,next){
    res.redirect(301,'/'+req.params.year+'/'+req.params.month+'/page/'+req.params.page+'/');
  });
  app.get('/:year/:month/page/:page/',function(req,res,next){
    if(req.sessionID){
      var pageIndex = req.params.page;
      var list = new List({
        pageIndex:pageIndex,
        pageSize:settings.pageSize,
        queryObj:{"time.monthQuery":req.params.year+"-"+req.params.month}
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
              prefix:"/"+req.params.year+"/"+req.params.month,
              pageIndex:parseInt(pageIndex),
              pageCount:parseInt(asyncResult.getPageCount)
            }
          });
        }else{
          res.end();
        }
      });
    }
  });

}