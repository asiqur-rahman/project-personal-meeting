const errorMiddleware = require('../middleware/error.middleware');
const webRoute = require('./web.route');
const {getDetailsFromSess} = require('../middleware/auth.middleware');
// const enumm = require('../utils/enum.utils');

module.exports = function (app) {

    app.use(function(req,res,next){
        // const details=getDetailsFromSess(req);
        // app.locals.roleCode = details?details.roleCode:undefined;
        // app.locals.userName = details?details.userName:undefined;
        // app.locals.roleName = details?details.roleName:undefined;
        // app.locals.superUserCode = enumm.role.SuperUser;
        // app.locals.adminCode = enumm.role.Admin;
        // app.locals.managerCode = enumm.role.Manager;
        // app.locals.employeeCode = enumm.role.Employee;
        // app.locals.currentEmployeeCode = details?details.currentEmployeeCode:undefined;
        // app.locals.dashboard = details?details.dashboard:'#';
        app.locals.hostName= req.protocol + '://' + req.get('host');
        // if(req.session.notification){
        //     const notification = req.session.notification;
        //     if(notification[0]==enumm.notification.Error){
        //         app.locals.error_Msg= notification[1];//req.flash('errorMsg');
        //     }
        //     else if(notification[0]==enumm.notification.Warning){
        //         app.locals.war_Msg= notification[1];//req.flash('errorMsg');
        //     }
        //     else if(notification[0]==enumm.notification.Info){
        //         app.locals.info_Msg= notification[1];//req.flash('errorMsg');
        //     }
        //     else if(notification[0]==enumm.notification.Success){
        //         app.locals.succ_Msg= notification[1];//req.flash('errorMsg');
        //     }
        //     req.session.notification=null;
        // }else{
        //     app.locals.error_Msg= undefined;
        //     app.locals.info_Msg= undefined;
        //     app.locals.war_Msg= undefined;
        //     app.locals.succ_Msg= undefined;
        // }
        next();
    });

    app.use(`/`, webRoute);
    
    // 404 error
    app.all('*', (req, res, next) => {
        res.render('Pages/pages-404', {
            layout: false
          });
    });

    app.use(errorMiddleware);
}