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

console.log(generateID());