module.exports.landingPageGet = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Home | Meeting | Brain Tech Solution',
        metaDescription:'Home | Meeting | Brain Tech Solution'
    };
    res.render('Landing/index',{layout: 'Layout'});
};

module.exports.landingPagePost = async(req, res, next) => {
    console.log("Post called")
    const {roomName}=req.body;
    // console.log(roomName)
    // res.locals = { 
    //     metaTitle: 'Home | Meeting | Brain Tech Solution',
    //     metaDescription:'Home | Meeting | Brain Tech Solution'
    // };
    res.redirect(`/join/${roomName}`);
    // res.render('Conference/client',{layout: false});
};

module.exports.joinRoomGet = async(req, res, next) => {
    console.log(req.body)
    res.locals = { 
        metaTitle: 'Home | Meeting | Brain Tech Solution',
        metaDescription:'Home | Meeting | Brain Tech Solution'
    };
    return res.render('Conference/client',{layout: false});
};
