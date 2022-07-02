const joi = require('@hapi/joi');

const schema = {
    conference:joi.object({
        roomName:joi.string().required(),
        roomId:joi.string().required(),
        hostSocketId:joi.string().required(),
        tokenForHost:joi.string().required(),
        tokenForOthers:joi.string().required(),
        scheduledStartDateTime:joi.string().required(),
        scheduledEndDateTime:joi.string(),
        branchId:joi.number().required(),
        conferenceStatus:joi.number().required(),
        ecVerification:joi.boolean().required(),
        routine:joi.string()
    })
}

module.exports.conferenceValidator = async (req,res,next)=>{
    req.body.routine=JSON.stringify(req.body.routine);
    const value=await schema.conference.validate(req.body);
    if(value.error){
        res.json({
            status:0,
            message: value.error.details[0].message
        })
    }
    else{
        next();
    }
};