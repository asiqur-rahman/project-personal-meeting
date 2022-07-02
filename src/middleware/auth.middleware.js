const jwt = require('jsonwebtoken');
const Config = require('../../config.json');

const auth = (...roles) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                res.json({
                    status:401,
                    message:"Access denied. No credentials sent !"
                });
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = Config.AppSettings.SECRET_JWT || "";

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            // const user = await UserModel.findOne({ id: decoded.user_id });
            // const user = await db.user.scope('authPurpose').findOne({ 
            //     where:{id:decoded.user_id},
            //     include:db.role,
            //     raw:true
            //  });
            //console.log(user);

            if (!decoded.user_id && !decoded.roleId) {
                res.json({
                    status:401,
                    message:"Authentication failed !"
                });
            }

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if ( roles.length && !roles.includes(decoded.role_id)) {
                res.json({
                    status:401,
                    message:"Unauthorized !"
                });
            }

            // if the user has permissions
            req.currentUser = decoded.user_id;

            //check Client IP
            console.log(decoded.clientIp);
            var clientIp= req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
            console.log(clientIp);
            if(clientIp.toString()==decoded.clientIp){
                next();
            }else{
                res.json({
                    status:401,
                    message:"Unauthorized IP Address !"
                });
            }

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports = auth;