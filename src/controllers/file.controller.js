let fs = require('fs'); 
let path = require('path');

module.exports.write = async (req, res, next) => {
    if(req.body.imageData){
        const dateTime=Date.now();
        const pathName=path.join(__dirname,"../../","public","files",req.body.imageName+dateTime+".png");
        // fs.writeFileSync(pathName, req.body.imageData,"UTF8");

        var base64Data = req.body.imageData.replace(/^data:image\/[a-z]+;base64,/, "");
        // console.log(base64Data)
        fs.writeFileSync(pathName, base64Data, 'base64', function(err) {
            return res.send({});
        });
        return res.send({pathName:path.join("/public","files",req.body.imageName+dateTime+".png")});
    }
    else{
        return res.send({});
    }
};

module.exports.read = async (req, res, next) => {
    fs.readFile(path.join(__dirname,"../../","public","files",req.body.imageName+".txt"), 'UTF8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        return res.status(200).send({data});
    });
};
