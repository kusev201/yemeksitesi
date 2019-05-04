
var mongoose        =require("mongoose"),
    Yemek           =require("./models/yemek"),
    Yorum           =require("./models/yorum");

    var data=[
        {
            adi:"Soslu Makarna",
            resim:"https://images.unsplash.com/photo-1453831362806-3d5577f014a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            aciklama:"Lezetli makarna süper"
        },
        {
            adi:"Pankek",
            resim:"https://images.unsplash.com/photo-1478369402113-1fd53f17e8b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            aciklama:"Kat kat güzel tatlı"
        },
        {
            adi:"Hamburger",
            resim:"https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            aciklama:"Nefis köfteli hamburger"
        }

    ]
    /*  -Veri Tabanı temizlik
        -Data Arrayindeki bilgileri veri tabanına ekliyecegiz,
        -hardcoded yorum ekliyeceğiz,
        -Yemek semasını güncelleyeceğiz,
        -app.js route güncelliyeceğiz
        -goster.js göster
        */    
function cerezData(){

    //Otomatik veri oluşturuyor
    //Tüm kayılar siliniyor
    /* Yemek.remove({},function (err) {
       if(err) {
           console.log(err);
       }else{
           console.log("Tüm kayıtlar silindi.");
           //Yeni kayıtlar ekleniyor (data dizisi)


       /*     data.forEach(function(degisken){ 
                Yemek.create(degisken,function(err,yemek){
                    if(err){
                        console.log(err);
                    }else
                    {
                        console.log("yeni yemek eklendi");

                        //Yeni yorum ekle
                        Yorum.create({
                            text: "Bu bir deneme yorumudur",
                            yazar:"bulent"
                        },function (err,yorum) {
                            if(err){
                                console.log(err);
                            }else{
                                yemek.yorumlar.push(yorum);
                                yemek.save();
                                console.log("Yeni yorum eklendi");
                            }
                        });
                    }
                });
           }); 
       }
    }); */
}
module.exports=cerezData;