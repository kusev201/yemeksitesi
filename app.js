var express     =require("express"),
app             =express(),
mongoose        =require("mongoose"),
passport        =require('passport'),
LocalStrategy   =require('passport-local'),
bodyparser      =require("body-parser"),
Yemek           =require("./models/yemek"),
methodOverride  =require("method-override"),
User            =require("./models/user"),
Yorum           =require("./models/yorum"),
cerezData       =require("./cerez");


mongoose.connect("mongodb://localhost/yemekSitesi");

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public/"));

app.set("view engine","ejs");
app.use(methodOverride("_method"));

console.log(__dirname);



cerezData();

app.use(require("express-session")({
secret:"bu gizli bir culemiz",
resave:false,
saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next) {
    res.locals.currentUser=req.user;
    next();
});

app.get("/",function (req,res) {
    res.render("home");
});

app.get("/yemekler",function (req,res) {
   //önce yemekleri veritabanından al
   Yemek.find({},function (err,yemeklerDB) {
       if(err){
           console.log(err);
       }else{
           console.log("***********************Yemekler******************");
           console.log(yemeklerDB);
           res.render("yemekler/yemekler",{yemekler: yemeklerDB});
       }
   });



   /*  res.render("yemekler",{yemekler: yemekler}); */
});

app.post("/yemekler",kullaniciGirisi,function (req,res) {
   var adi      =req.body.adi;
   var resim    =req.body.resim;
   var aciklama    =req.body.aciklama;
   var olusturan    ={id:req.user._id,username:req.user.username}
   var yeniYemek= {adi:adi, resim:resim,aciklama:aciklama,olusturan:olusturan};
   //yemekler.push(yeniYemek);
   //Yeni yemek oluştur
   Yemek.create(yeniYemek,function (err,yeniYemekDB) {
       //var currentUser=req.user;
       if(err){
           console.log(err);
           res.redirect("/");
       }
       else{
        //currentUser.yemek.push(yeniYemekDB);
        //currentUser.save();
        res.redirect("/yemekler");
       }
       
   });
    
});

app.get("/yemekler/yeni",kullaniciGirisi,function (req,res) {
    res.render("yemekler/yeni");
    
})

app.get("/yemekler/:id",function (req,res) {
    
     Yemek.findById(req.params.id).populate("yorumlar").exec(function (err, bulunanYemek) {
         console.log(bulunanYemek);
         res.render("yemekler/goster",{yemek:bulunanYemek});
   });
});
//yemek güncelle
app.get("/yemekler/:id/duzenle",kimlikKontrol,function (req,res) {
    Yemek.findById(req.params.id,function (err,bulunanYemek) {
        if(err){
            console.log(err);
            res.redirect("/yemekler");
        }else{
            res.render("yemekler/duzenle",{yemek:bulunanYemek});
        }
    });
    
    
});

//güncelle
app.put("/yemekler/:id",kimlikKontrol,function (req,res) {
    Yemek.findByIdAndUpdate(req.params.id,req.body.yemek,function (err,guncellenmisYemek) {
       if(err) 
       {
           console.log(err);
           res.redirect("/yemekler");
       }
       else{
           res.redirect("/yemekler/"+req.params.id);

       }
    });

});

app.delete("/yemekler/:id",kimlikKontrol,function (req,res) {
   Yemek.findByIdAndRemove(req.params.id,function (err) {
      if(err) {
          console.log(err);
          res.redirect("/yemekler");
      }
      else
      {
        console.log("YEMEK KAYDI SİLİNDİ");
        res.redirect("/yemekler");
      }
   });
});

/************* USER ROUTE ******************* */
app.get("/user/:id/profile",kullaniciGirisi, function (req,res) {
    Yemek.find({},function (err,yemeklerDB) {
        if(err){
            console.log(err);
        }
        else{
            res.render("./userProfile",{yemekler:yemeklerDB});

        }
    });
   
})

/************ Yorum ROUTE ********************/

app.get("/yemekler/:id/yorumlar/yeni",kullaniciGirisi,function (req,res) {
    Yemek.findById(req.params.id,function (err,bulunanYemek) {
       if(err) {
           console.log(err);
       }else{
           res.render("yorumlar/yeni",{yemek:bulunanYemek});
       }
    });
});


app.post("/yemekler/:id/yorumlar",kullaniciGirisi,function (req,res) {
   
    Yemek.findById(req.params.id,function (err,bulunanYemek) {
        if(err) {
            
            console.log(err);
            res.redirect("/yemekler");
        }else{
            console.log("=================================KAYIT=========================== ");
           Yorum.create(req.body.yorum,function (err,yorum) {
               yorum.yazar.id=req.user._id;
               yorum.yazar.username=req.user.username;
               yorum.save();
               bulunanYemek.yorumlar.push(yorum);
               bulunanYemek.save();
               res.redirect("/yemekler/"+bulunanYemek._id);
           });
        }
     });


});

/*============================ADMIN ROUTE===========================*/
function generateID() {
    var id="";
    var anahtarlar="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var uzunluk=100;

    for (let index = 0; index < uzunluk; index++) {
        id +=anahtarlar.charAt(Math.floor(Math.random() * anahtarlar.length));
        // console.log(index);
        // console.log(Math.floor(Math.random() * anahtarlar.length));
        // console.log(id);
        
    }
    //var sayi=Math.random() * anahtarlar.length;
    //console.log(sayi +" " + anahtarlar.length);
    return id;

}


app.get("/admin/validator",function (req,res) {
    res.render("admin/validator");
});
app.post("/admin/validator",function (req, res) {
    var secret=req.body.secret;
    console.log(secret);
    if(secret=="nodejsogreniyorum"){
        var retrievedID=generateID();
        console.log(retrievedID);
        app.set("id",retrievedID);
        res.send(retrievedID);
    }else{
        console.log("Wrong key");
        res.redirect("/admin/validator");
    }
});

app.get("/admin/giris",function (req,res) {
    res.render("admin/adminForm")
});
app.post("/admin/giris",function (req,res) {
    var adminID=req.body.id;
    console.log(adminID);
    if(app.get("id")==adminID){
        User.find({},(err,usersDB)=>{
            res.render("admin/infos",{users:usersDB});
        });

    }else
    {
        res.redirect("/yemekler");
    }
    
});


/*============================AUTH ROUTES============================*/
app.get("/kaydol",function (req,res) {
   res.render("kaydol") 
});

app.post("/kaydol",function (req,res) {
    var yeniKullanici=new User({username:req.body.username});
    User.register(yeniKullanici,req.body.password,function (err,kullanici) {
        if(err){
            console.log(err);
            return res.render("/kaydol");
        }
        passport.authenticate("local")(req,res,function () {
            res.redirect("/yemekler");
        })
    });
});

//giriş yap
app.get("/girisyap",function (req,res) {
    res.render("girisyap");
});

app.post("/girisyap",passport.authenticate("local",{
    successRedirect:"/yemekler",
    successFailure: "/"
}),function (req,res) {});

//çikis yap
app.get("/cikisyap",function (req,res) {
    req.logOut();
    res.redirect("/");
})

function kullaniciGirisi(req,res,next) {
    if(req.isAuthenticated())
    { return next();
    }
        
    res.redirect("/girisyap");
    
    
}
function kimlikKontrol(req,res,next) {

    if(req.isAuthenticated){
        Yemek.findById(req.params.id,function (err,bulunanYemek) {
           if(err) {
               console.log(err);
               res.redirect("back");
           }else{
               if(bulunanYemek.olusturan.id.equals(req.user.id)){
                    next();
               }else{
                   res.redirect("back");
               }
           }
        });
    }
    
}
/*===================================================================*/

var server=app.listen(3000,function () {
   console.log("sunucu portu : %d ", server.address().port) ;
});
