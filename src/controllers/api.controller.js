const db = require('../models/model');
const StatusEnum = require('../utils/enum.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const {
    appConfig,
    appSettings
} = require('../config/config');
const {
    participant
} = require('../models/model');
const Op = require('sequelize').Op;

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

module.exports.getAllMeeting = async (req, res, next) => {
    const conferences = await db.conference.findAll({
        // include:db.role,
        raw: true
    });
    // console.log(conferences);
    if (conferences) {
        res.status(200).send(conferences);
    } else {
        res.status(200).send();
    }
};

module.exports.getAllMeetingByBranchId = async (req, res, next) => {
    const conferences = await db.conference.findAll({
        where: {
            [Op.and]: [{
                branchId: req.params.branchId
            }, {
                conferenceStatus: req.params.conferenceStatus ? req.params.conferenceStatus : 1
            }]
        },
        raw: true
    });
    // console.log(conferences);
    if (conferences) {
        res.status(200).send(conferences);
    } else {
        res.status(200).send();
    }
};

module.exports.getMeetingById = async (req, res, next) => {
    const conference = await db.conference.findOne({
        where: {
            id: req.params.id
        },
        // include:db.role,
        raw: true
    });
    if (conference) {
        res.status(200).send(conference);
    } else {
        res.status(204).send();
    }
};


module.exports.getMeetingFullDetailsById = async (req, res, next) => {
    await db.conference.findAll({
        where: {
            id: req.params.id
        },
        include:db.participant,
        include:{
            model: db.participant,
            include: db.participantTime
          }
    }).then((conference)=>{
        if (conference) {
            res.status(200).send(conference);
        } else {
            res.status(204).send();
        }
    });
};


module.exports.deleteMeetingById = async (req, res, next) => {
    await db.conference.destroy({
        where: {
            id: req.params.id
        }
    }).then(conference => {
        res.status(200).json({
            statusCode: 200,
            message: 'Meeting successfully Deleted ! Id=' + req.params.id
        });
    }).catch(function (err) {
        res.status(502).json({
            statusCode: 502,
            message: err.message
        });
    });
};

module.exports.getMeetingByRoomId = async (roomId) => {
    return await db.conference.findOne({
        where: {
            roomId: roomId
        },
        raw: true
    });
};

module.exports.getGeoLocationByIp = async (ipAddress) => {
    // const url =`http://ip-api.com/json/${ipAddress}?fields=status,country,region,regionName,city,zip,lat,lon,query`;
    const url =`http://ip-api.com/json/${ipAddress}?fields=status,country`;
    return ipAddress=='::1'?"Internal Network":await axios.get(url,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(async (geoLocation) => {
        if(geoLocation.data){
            // return `${geoLocation.data.city},${geoLocation.data.country}-(${geoLocation.data.lat},${geoLocation.data.lon})`;
            return `${geoLocation.data.country}`;
        }else{
            return "";
        }
        
    });
};


module.exports.addRoomParticipant = async (data) => {
    // console.log("addRoomParticipant ",data)
    await db.conference.findOne({
        where: {
            roomId: data.room
        },
        raw: true
    }).then(async (conference) => {
        if (conference) {
            data.conferenceId = conference.id;
            await db.participant.findOne({
                where: {
                    socketId: data.socketId.toString()
                },
                raw: true
            }).then(async (participant) => {
                if (participant) {
                    //When participant found then search for participant last entry time
                    await db.participantTime.findOne({
                        where: {
                            [Op.and]: [{
                                    participantId: participant.id
                                },
                                {
                                    exitTime: {
                                        [Op.eq]: null
                                    }
                                }
                            ]
                        },
                        raw: true
                    }).then(async (participantTime) => {
                        if (participantTime) {
                            // data.participantId=participant.id;

                            // await db.participantTime.update({exitTime:new Date().toISOString()},{ 
                            //     where:{id: participantTime.id}
                            //     }).then(async () => {
                            //         await db.participantTime.create(data)
                            //         .then(() => {
                            //             return participant.id;
                            //         }).catch(function (err) {
                            //             console.log("Participant Create Error : " + err);
                            //             return 0;
                            //         });
                            //     }).catch(function (err) {
                            //         console.log("Participant Update Error : " + err);
                            //         return false;
                            //     }
                            // );
                        } else {
                            data.participantId = participant.id;
                            await db.participantTime.create(data)
                                .then(() => {
                                    return participant.id;
                                }).catch(function (err) {
                                    console.log("Participant Create Error : " + err);
                                    return 0;
                                });
                        }
                    });

                } else {
                    await db.participant.create(data)
                        .then(async (participant) => {
                            data.participantId = participant.id;
                            await db.participantTime.create(data)
                                .then(() => {
                                    return participant.id;
                                }).catch(function (err) {
                                    console.log("Participant Create Error : " + err);
                                    return 0;
                                });
                        }).catch(function (err) {
                            console.log("Participant Create Error : " + err);
                            return 0;
                        });
                };
            });
        }
    });
};

module.exports.participantLeave = async (data) => {
    // console.log(data);
    const participant = await db.participant.findOne({
        where: {
            socketId: data.socketId.toString()
        },
        raw: true
    });
    if (participant) {
        // console.log("participant",participant);
        const participantTime = await db.participantTime.findOne({
            where: {
                [Op.and]: [{
                        participantId: participant.id
                    },
                    {
                        exitTime: {
                            [Op.eq]: null
                        }
                    }
                ]
            },
            raw: true
        });
        if (participantTime) {
            // console.log("participantTime",participantTime);
            await db.participantTime.update({
                exitTime: new Date().toISOString()
            }, {
                where: {
                    id: participantTime.id
                }
            }).then(() => {
                return true
            }).catch(function (err) {
                console.log("Participant Update Error : " + err);
                return false;
            });
        }
    };
};

module.exports.updateMeetingTimeByRoomId = async (roomId, timeFor, host=0) => {
    var updateData = {};
    var date = new Date().toLocaleString({
        hour: 'numeric',
        hour12: false
    });
    if (timeFor == StatusEnum.timeFor.startMeeting) {
        updateData = {
            startDateTime: date,
            conferenceStatus: StatusEnum.conferenceStatus.Running
        };
    } else {
        updateData = {
            endDateTime: date, //.toISOString({ hour: 'numeric', hour12: false })//toJSON()
            conferenceStatus: StatusEnum.conferenceStatus.Complete
        };
    }
    await db.conference.update(
            updateData, {
                where: {
                    roomId: roomId
                }
            }
        )
        .then(conference => {
            // console.log("Host ",host)
            if(host==1){
                this.endMeeting(roomId);
            }
            return true;
        }).catch(function (err) {
            return false;
        });
};

module.exports.endMeeting = async (roomId) => {
    await db.conference.findOne({
        where: {
            roomId: roomId
        },
        raw: true
        }).then((conference)=>{
            if (conference) {
                db.participantTime.findAll({
                    where: {
                        [Op.and]: [{
                            '$participant.conferenceId$': { [Op.eq]: conference.id }
                        },
                        {
                            exitTime: {
                                [Op.eq]: null
                            }
                        }
                    ]
                    },
                    include: [{
                        model: db.participant,
                        as: 'participant',
                        // required: true
                    }],
                    raw: true
                }).then((result)=>{
                    const exitTime=new Date().toISOString();
                    result.forEach(async (element) => {
                        console.log(element.id);
                        await db.participantTime.update({exitTime:exitTime},{
                            where: {
                                id:element.id
                            }
                        });
                    });
                });
            }
        });
    }

            module.exports.MeetingRoomValidation = async (roomId, token) => {
                let result = await db.conference.findOne({
                    where: {
                        [Op.and]: [{
                            roomId: roomId
                        }],
                        [Op.or]: [{
                            tokenForHost: token
                        }, {
                            tokenForOthers: token
                        }]
                    },
                    raw: true
                });
                if (result) {
                    if (result.tokenForHost === token) {
                        return StatusEnum.role.Host;
                    } else if (result.tokenForHost === token) {
                        return StatusEnum.role.CoHost;
                    } else {
                        return StatusEnum.role.None;
                    }
                } else {
                    return StatusEnum.role.None;
                }
            };

            module.exports.createMeeting = async (req, res, next) => {
                // console.log(req.body)
                // req.body.conferenceDateTime=new Date(Date.parse(req.body.conferenceDateTime));
                // console.log(req.body.conferenceDateTime)
                await db.conference.create(req.body)
                    .then(appoinment => {
                        res.status(201).json({
                            statusCode: 201,
                            message: 'Conference was created, Id:' + appoinment.Id,
                            appoinmentId: appoinment.Id
                        });
                    }).catch(function (err) {
                        console.log("Conference Create Error : " + err);
                        res.status(200).json({
                            statusCode: 502,
                            message: err.message
                        });
                    });
            };

            module.exports.getCurrentUser = async (req, res, next) => {
                const user = await db.user.findOne({
                    where: {
                        id: req.currentUser
                    },
                    include: db.role,
                    raw: true
                });
                if (user) {
                    res.status(200).send(user);
                } else {
                    res.status(204).send();
                }
            };

            module.exports.getUserByuserName = async (req, res, next) => {
                const user = await db.user.findOne({
                    where: {
                        [Op.or]: [{
                            username: req.params.username
                        }, {
                            email: req.params.username
                        }]
                    },
                    include: db.role,
                    raw: true
                });
                if (user) {
                    res.status(200).send(user);
                } else {
                    res.status(204).send();
                }
            };

            module.exports.userLogin = async (req, res, next) => {
                var clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
                //console.log("LoginIp : "+clientIp)
                const {
                    username,
                    password
                } = req.body;
                const user = await db.user.scope('loginPurpose').findOne({
                    where: {
                        [Op.or]: [{
                            username: username
                        }, {
                            email: username
                        }]
                    },
                    raw: true
                });
                if (!user) {
                    res.send({
                        status: 401,
                        message: "Unable to login !"
                    });
                } else {
                    const isMatch = await bcrypt.compare(password, user.password);

                    if (!isMatch) {
                        res.status(401).send({
                            status: 401,
                            message: "Incorrect password !"
                        });
                    } else {
                        // user matched!
                        const secretKey = appConfig.SECRET_JWT || "";
                        const token = jwt.sign({
                            user_id: user.id.toString(),
                            role_id: user.roleId.toString(),
                            clientIp: clientIp.toString()
                        }, secretKey, {
                            expiresIn: appConfig.SessionTimeOut
                        });
                        const {
                            password,
                            ...userWithoutPassword
                        } = user;
                        res.status(200).send({
                            ...userWithoutPassword,
                            token,
                            sessionTime: appConfig.SessionTimeOut
                        });
                    }
                }


            };

            // hash password if it exists
            hashPassword = async (req) => {
                if (req.body.password) {
                    req.body.password = await bcrypt.hash(req.body.password, 8);
                }
            }