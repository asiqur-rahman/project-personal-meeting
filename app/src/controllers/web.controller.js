
module.exports.landingPageGet = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Home | Brain Tech Solution',
        metaDescription:'Home | Brain Tech Solution'
    };
    res.render('Landing/index',{layout: 'layout'});
};

module.exports.landingPagePost = async(req, res, next) => {
    const {username,useremail,roomName,roomPassword,cameraOn,audioOn,screenShareOnly,openForAll}=req.body;
    res.redirect(`/join/${roomName}?name=${username}&audio=${audioOn?audioOn:0}&video=${cameraOn?cameraOn:0}&screen=${screenShareOnly?screenShareOnly:0}`);
};

module.exports.joinRoomGet = async(req, res, next) => {
    console.log(req.body)
    res.locals = { 
        metaTitle: 'Room | Brain Tech Solution',
        metaDescription:'Room | Brain Tech Solution'
    };
    return res.render('Room/client',{layout: false});
};

module.exports.error = async(req, res, next) => {
    console.log(req.query)
    res.locals = { 
        metaTitle: 'Error | Brain Tech Solution',
        metaDescription:'Error | Brain Tech Solution',
        errorData:req.query.errorMsg?req.query.errorMsg:'Something Wrong !'
    };
    return res.render('Error/index',{layout: false});
};
