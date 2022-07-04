
module.exports.landingPageGet = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Home | Meeting | Brain Tech Solution',
        metaDescription:'Home | Meeting | Brain Tech Solution'
    };
    res.render('Landing/index',{layout: 'Layout'});
};

module.exports.landingPagePost = async(req, res, next) => {
    const {roomName}=req.body;
    res.redirect(`/join/${roomName}`);
};

module.exports.joinRoomGet = async(req, res, next) => {
    console.log(req.body)
    res.locals = { 
        metaTitle: 'Home | Meeting | Brain Tech Solution',
        metaDescription:'Home | Meeting | Brain Tech Solution'
    };
    return res.render('Meeting/index',{layout: false});
};

module.exports.error = async(req, res, next) => {
    console.log(req.body)
    res.locals = { 
        metaTitle: 'Home | Meeting | Brain Tech Solution',
        metaDescription:'Home | Meeting | Brain Tech Solution'
    };
    return res.render('Error/index',{layout: false});
};
