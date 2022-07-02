
module.exports.login = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'V-KYC | DATASOFT',
        metaDescription:'V-KYC | DATASOFT'
    };
    res.render('Login/index',{layout: 'Layout'});
};

module.exports.register = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'V-KYC | DATASOFT',
        metaDescription:'V-KYC | DATASOFT'
    };
    res.render('Login/register.ejs',{layout: 'Layout'});
};

module.exports.landingPage = async(req, res, next) => {
    res.locals = { 
        metaTitle: 'Home | Meeting | Brain Tech Solution',
        metaDescription:'Home | Meeting | Brain Tech Solution'
    };
    res.render('Landing/index',{layout: 'Layout'});
};
