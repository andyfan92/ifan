var express=require('express')
var path=require('path')
var mongoose=require('mongoose')
var Movie=require('./modules/movie')
var User=require('./modules/user')
var _=require('underscore')
var port=process.env.port||3000
var app=express()
mongoose.connect('mongodb://192.168.85.128:12345/ifan')
app.set('views','./views/pages')
app.set('view engine','jade')

app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join('./','public')))
app.listen(port)
console.log('ifan started on port'+ port)
app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
        console.log(err)
    }
        res.render('index',{
            title:'ifan 首页',
            movies: movies
        })
   
})
    // res.render('index',{title:'ifan 首页',movies:[{title:'机械战警',_id:1,poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'},
    //  {title:'机械战警',_id:1,poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'},{title:'机械战警',_id:1,poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'},
 //        {title:'机械战警',_id:1,poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'}]})
})
app.get('/movie/:id',function(req,res){
    var id=req.params.id
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'ifan 详情页',
            movie:movie
        })
    })
    /*res.render('detail',{title:'ifan 详情页',movie:{
        doctor:"卡梅隆",
        country:"美国",
        title:"机械战警",
        year:2014,
        post:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
        language:"英语",
        flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf"

    }})*/
})
app.post('/user/signup',function(req,res){
    var _user=req.body.user
    var user=new User(_user)
    User.find({name:_user.name},function(err,user){
        if(err){
            console.log(err)
        }
        if(user){
            return res.redirect('/') 
        }
        else{
             user.save(function(err,user){
    if(err){
        console.log(err)
    }
     return res.redirect('/')
     })
        }
    })
   
})
app.get('/admin/userlist',function(req,res){
    User.fetch(function(err,users){
        if(err){
            console.log(err)
        }
        res.render('userlist',{
            title:"ifan用户页",
            users:users

        })
    })
})
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'ifan 后台录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }

    })
})
app.post('/admin/movie/new',function(req,res){
    var id=req.body.movie._id
    var movieObj=req.body.movie
    var _movie
    if(id!=='undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }
            _movie=_.extend(movie,movieObj)
            _movie.save(function(err,movie){
                if(err){
                    console.log(err)
                }
            res.redirect('/movie/'+movie._id)    
            })

        })
    }
    else{
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country, 
            language:movieObj.language, 
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function(err,movie){
            if(err){
                console.log(err)
            }
            res.redirect('/movie/'+movie._id)
        })
    }
})

app.get('/admin/update/:id',function(req,res){
    var id=req.params.id 
    if(id){
        Movie.findById(id,function(err,movies){
            res.render('admin',{
                title:'后台更新页',
                movies:movies
            })
        })
    }
})
app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('movielist',{
            title:'ifan 列表页',
            movies:movies
        })
    })
})

app.delete('/admin/list',function(req,res){
    var id=req.query.id;
    console.log(id);
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
})