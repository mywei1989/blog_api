var async = require('async');
var settings = require('../settings/settings.js');
var List = require('../models/list.js');
var Post = require('../models/post.js');
var Info = require('../models/info.js');

module.exports = function(app){
  //关于 简历 链接 书单 碎语
  app.get('/:info(about|profile|links|booklist|tweets)?',function(req,res,next){
    if(req.sessionID){
      var list = new List({});
      var post = new Post({});
      var info = new Info({
        queryObj:{"name":req.params.info}
      });

      async.parallel({
        getArticle:function(done){
          info.get(function(err,doc){
            if(!(err)&&doc){
              doc.tags = [];
              done(null,doc);
            }else{
              //done(404);
              done(null,doc);
            }
          });
        }
      },function(asyncErr,asyncResult){
        if(!asyncErr){
          res.json({
            article:asyncResult.getArticle,
          });
        }else{
          //404
          res.send('404');
          res.end();
        }
      });
    }
  });

};