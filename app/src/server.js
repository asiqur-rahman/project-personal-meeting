
'use strict';

const { Server } = require('socket.io');
const http = require('http');
const https = require('https');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const Config = require('../../config.json');
const PageRouter = require('../../src/routes/routes');
const bodyParser = require('body-parser');

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use('/public', express.static('public'));
app.use( '/assets', express.static( path.join( __dirname, 'assets' )));
app.use('/files',express.static('files'));
app.get('/layouts/', function(req, res) {
    res.render('view');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '10mb'}));

const Logger = require('./Logger');
const log = new Logger('server');

const httpPort = Config.AppSettings.HTTP_PORT; 
const httpsPort = Config.AppSettings.HTTPS_PORT;

let io, httpServer, httpsServer, httpHost, httpsHost;
const fs = require('fs');
let options = Config.AppSettings.IS_HTTPS_ENABLED?
{
    cert: fs.readFileSync(path.join(__dirname, '../ssl/ssl.crt'), 'utf-8'),
    ca: fs.readFileSync(path.join(__dirname, '../ssl/ssl.ca-bundle'), 'utf-8'),
    key: fs.readFileSync(path.join(__dirname, '../ssl/ssl.key'), 'utf-8')
}:
{
    key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem'), 'utf-8'),
};

httpsServer = https.createServer(options, app);
httpsHost = 'https://' + 'localhost' + ':' + httpsPort;

httpServer = http.createServer(app);
httpHost = 'http://' + 'localhost' + ':' + httpPort;

/*  
    Set maxHttpBufferSize from 1e6 (1MB) to 1e7 (10MB)
*/
io = new Server({
    maxHttpBufferSize: 1e7,
    transports: ['websocket'],
}).listen(httpsServer);

// console.log(io);

// Swagger config
const yamlJS = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = yamlJS.load(path.join(__dirname + '/../api/swagger.yaml'));

// Api config
const { v4: uuidV4 } = require('uuid');
const apiBasePath = '/api/v1'; // api endpoint path
const api_docs = httpsHost + apiBasePath + '/docs'; // api docs
const api_key_secret = Config.AppSettings.API_KEY_SECRET ;

// Turn config
const turnUrls = Config.AppSettings.TURN_URLS;
const turnUsername = Config.AppSettings.TURN_USERNAME;
const turnCredential = Config.AppSettings.TURN_PASSWORD;

// directory
const dir = {
    public: path.join(__dirname, '../../', 'public'),
};
// html views
const views = {
    about: path.join(__dirname, '../../', 'public/views/about.html'),
    client: path.join(__dirname, '../../', 'public/views/client.html'),
    landing: path.join(__dirname, '../../', 'public/views/landing.html'),
    newCall: path.join(__dirname, '../../', 'public/views/newcall.html'),
    notFound: path.join(__dirname, '../../', 'public/views/404.html'),
    permission: path.join(__dirname, '../../', 'public/views/permission.html'),
    privacy: path.join(__dirname, '../../', 'public/views/privacy.html'),
};

let channels = {}; // collect channels
let sockets = {}; // collect sockets
let peers = {}; // collect peers info grp by channels

app.use(cors()); // Enable All CORS Requests for all origins
app.use(compression()); // Compress all HTTP responses using GZip
app.use(express.json()); // Api parse body data as json
app.use(express.static(dir.public)); // Use all static files from the public folder
app.use(bodyParser.urlencoded({ extended: true })); // Need for Slack API body parser
app.use(bodyParser.json({limit: '10mb'}));

// Remove trailing slashes in url handle bad requests
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        log.debug('Request Error', {
            header: req.headers,
            body: req.body,
            error: err.message,
        });
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        let query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});

// Define All Route
PageRouter(app);

// // all start from here
// app.get(['/'], (req, res) => {
//     res.sendFile(views.landing);
// });

// set new room name and join
app.get(['/newcall'], (req, res) => {
    res.sendFile(views.newCall);
});

// if not allow video/audio
app.get(['/permission'], (req, res) => {
    res.sendFile(views.permission);
});

// privacy policy
app.get(['/privacy'], (req, res) => {
    res.sendFile(views.privacy);
});

// no room name specified to join
// app.get('/join/', (req, res) => {
//     if (Object.keys(req.query).length > 0) {
//         log.debug('Request Query', req.query);
//         /* 
//             http://localhost:3000/join?room=test&name=braintechsolution&audio=1&video=1&screen=1&notify=1
//             https://braintechsolution.up.railway.app/join?room=test&name=braintechsolution&audio=1&video=1&screen=1&notify=1
//             https://braintechsolution.herokuapp.com/join?room=test&name=braintechsolution&audio=1&video=1&screen=1&notify=1
//         */
//         const { room, name, audio, video, screen, notify } = req.query;
//         // all the params are mandatory for the direct room join
//         if (room && name && audio && video && screen && notify) {
//             return res.sendFile(views.client);
//         }
//     }
//     res.redirect('/');
// });

// Join Room *
// app.get('/join/*', (req, res) => {
//     res.sendFile(views.client);
// });

// api docs
app.use(apiBasePath + '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// request meeting room endpoint
app.post([apiBasePath + '/meeting'], (req, res) => {
    // check if user was authorized for the api call
    let authorization = req.headers.authorization;
    if (authorization != api_key_secret) {
        log.debug('BrainTechSolution get meeting - Unauthorized', {
            header: req.headers,
            body: req.body,
        });
        return res.status(403).json({ error: 'Unauthorized!' });
    }
    // setup meeting URL
    let host = req.headers.host;
    let meetingURL = getMeetingURL(host);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ meeting: meetingURL }));

    // log.debug the output if all done
    log.debug('BrainTechSolution get meeting - Authorized', {
        header: req.headers,
        body: req.body,
        meeting: meetingURL,
    });
});

/**
 * Request meeting room endpoint
 * @returns  entrypoint / Room URL for your meeting.
 */
function getMeetingURL(host) {
    return 'http' + (host.includes('localhost') ? '' : 's') + '://' + host + '/join/' + uuidV4();
}

// not match any of page before, so 404 not found
// app.get('*', function (req, res) {
//     res.sendFile(views.notFound);
// });

const iceServers = [];

iceServers.push(
    {
        urls: 'stun:stun.l.google.com:19302',
    },
    {
        urls: turnUrls,
        username: turnUsername,
        credential: turnCredential,
    },
);

httpServer.listen(httpPort, null, () => {
    // server settings
    log.debug('For HTTP', {
        server: httpHost,
    });
});
httpsServer.listen(httpsPort, null, () => {
    // server settings
    log.debug('For HTTPS', {
        server: httpsHost,
    });
    log.debug('Settings ', {
        iceServers: iceServers,
        api_docs: api_docs,
        api_key_secret: api_key_secret,
        node_version: process.versions.node,
    });
});

/**
 * On peer connected
 * Users will connect to the signaling server, after which they'll issue a "join"
 * to join a particular channel. The signaling server keeps track of all sockets
 * who are in a channel, and on join will send out 'addPeer' events to each pair
 * of users in a channel. When clients receive the 'addPeer' even they'll begin
 * setting up an RTCPeerConnection with one another. During this process they'll
 * need to relay ICECandidate information to one another, as well as SessionDescription
 * information. After all of that happens, they'll finally be able to complete
 * the peer connection and will be in streaming audio/video between eachother.
 */
io.sockets.on('connect', (socket) => {
    log.debug('[' + socket.id + '] connection accepted');

    socket.channels = {};
    sockets[socket.id] = socket;

    const transport = socket.conn.transport.name; // in most cases, "polling"
    log.debug('[' + socket.id + '] Connection transport', transport);

    /**
     * Check upgrade transport
     */
    socket.conn.on('upgrade', () => {
        const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
        log.debug('[' + socket.id + '] Connection upgraded transport', upgradedTransport);
    });

    /**
     * On peer diconnected
     */
    socket.on('disconnect', (reason) => {
        for (let channel in socket.channels) {
            removePeerFrom(channel);
        }
        log.debug('[' + socket.id + '] disconnected', { reason: reason });
        delete sockets[socket.id];
    });

    /**
     * On peer join
     */
    socket.on('join', (config) => {
        log.debug('[' + socket.id + '] join ', config);

        let channel = config.channel;
        let channel_password = config.channel_password;
        let peer_name = config.peer_name;
        let peer_video = config.peer_video;
        let peer_audio = config.peer_audio;
        let peer_hand = config.peer_hand;
        let peer_rec = config.peer_rec;

        if (channel in socket.channels) {
            log.debug('[' + socket.id + '] [Warning] already joined', channel);
            return;
        }
        // no channel aka room in channels init
        if (!(channel in channels)) channels[channel] = {};

        // no channel aka room in peers init
        if (!(channel in peers)) peers[channel] = {};

        // room locked by the participants can't join
        if (peers[channel]['lock'] === true && peers[channel]['password'] != channel_password) {
            log.debug('[' + socket.id + '] [Warning] Room Is Locked', channel);
            socket.emit('roomIsLocked');
            return;
        }

        // collect peers info grp by channels
        peers[channel][socket.id] = {
            peer_name: peer_name,
            peer_video: peer_video,
            peer_audio: peer_audio,
            peer_hand: peer_hand,
            peer_rec: peer_rec,
        };
        log.debug('connected peers grp by roomId', peers);

        addPeerTo(channel);

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;

        // Send some server info to joined peer
        sendToPeer(socket.id, sockets, 'serverInfo', { peers_count: Object.keys(peers[channel]).length });
    });

    /**
     * Add peers to channel
     * @param {string} channel room id
     */
    async function addPeerTo(channel) {
        for (let id in channels[channel]) {
            // offer false
            await channels[channel][id].emit('addPeer', {
                peer_id: socket.id,
                peers: peers[channel],
                should_create_offer: false,
                iceServers: iceServers,
            });
            // offer true
            socket.emit('addPeer', {
                peer_id: id,
                peers: peers[channel],
                should_create_offer: true,
                iceServers: iceServers,
            });
            log.debug('[' + socket.id + '] emit addPeer [' + id + ']');
        }
    }

    /**
     * Remove peers from channel
     * @param {string} channel room id
     */
    async function removePeerFrom(channel) {
        if (!(channel in socket.channels)) {
            log.debug('[' + socket.id + '] [Warning] not in ', channel);
            return;
        }
        try {
            delete socket.channels[channel];
            delete channels[channel][socket.id];
            delete peers[channel][socket.id]; // delete peer data from the room
            switch (Object.keys(peers[channel]).length) {
                case 0: // last peer disconnected from the room without room lock & password set
                case 2: // last peer disconnected from the room having room lock & password set
                    delete peers[channel]; // clean lock and password value from the room
                    break;
            }
        } catch (err) {
            log.error('Remove Peer', toJson(err));
        }
        log.debug('connected peers grp by roomId', peers);

        for (let id in channels[channel]) {
            await channels[channel][id].emit('removePeer', { peer_id: socket.id });
            socket.emit('removePeer', { peer_id: id });
            log.debug('[' + socket.id + '] emit removePeer [' + id + ']');
        }
    }

    /**
     * Relay ICE to peers
     */
    socket.on('relayICE', (config) => {
        let peer_id = config.peer_id;
        let ice_candidate = config.ice_candidate;

        // log.debug('[' + socket.id + '] relay ICE-candidate to [' + peer_id + '] ', {
        //     address: config.ice_candidate,
        // });

        sendToPeer(peer_id, sockets, 'iceCandidate', {
            peer_id: socket.id,
            ice_candidate: ice_candidate,
        });
    });

    /**
     * Relay SDP to peers
     */
    socket.on('relaySDP', (config) => {
        let peer_id = config.peer_id;
        let session_description = config.session_description;

        log.debug('[' + socket.id + '] relay SessionDescription to [' + peer_id + '] ', {
            type: session_description.type,
        });

        sendToPeer(peer_id, sockets, 'sessionDescription', {
            peer_id: socket.id,
            session_description: session_description,
        });
    });

    /**
     * Handle Room action
     */
    socket.on('roomAction', (config) => {
        //log.debug('[' + socket.id + '] Room action:', config);
        let room_is_locked = false;
        let room_id = config.room_id;
        let peer_name = config.peer_name;
        let password = config.password;
        let action = config.action;
        //
        try {
            switch (action) {
                case 'lock':
                    peers[room_id]['lock'] = true;
                    peers[room_id]['password'] = password;
                    sendToRoom(room_id, socket.id, 'roomAction', {
                        peer_name: peer_name,
                        action: action,
                    });
                    room_is_locked = true;
                    break;
                case 'unlock':
                    delete peers[room_id]['lock'];
                    delete peers[room_id]['password'];
                    sendToRoom(room_id, socket.id, 'roomAction', {
                        peer_name: peer_name,
                        action: action,
                    });
                    break;
                case 'checkPassword':
                    let config = {
                        peer_name: peer_name,
                        action: action,
                        password: password == peers[room_id]['password'] ? 'OK' : 'KO',
                    };
                    sendToPeer(socket.id, sockets, 'roomAction', config);
                    break;
            }
        } catch (err) {
            log.error('Room action', toJson(err));
        }
        log.debug('[' + socket.id + '] Room ' + room_id, { locked: room_is_locked, password: password });
    });

    /**
     * Relay NAME to peers
     */
    socket.on('peerName', (config) => {
        let room_id = config.room_id;
        let peer_name_old = config.peer_name_old;
        let peer_name_new = config.peer_name_new;
        let peer_id_to_update = null;

        for (let peer_id in peers[room_id]) {
            if (peers[room_id][peer_id]['peer_name'] == peer_name_old) {
                peers[room_id][peer_id]['peer_name'] = peer_name_new;
                peer_id_to_update = peer_id;
            }
        }

        if (peer_id_to_update) {
            log.debug('[' + socket.id + '] emit peerName to [room_id: ' + room_id + ']', {
                peer_id: peer_id_to_update,
                peer_name: peer_name_new,
            });

            sendToRoom(room_id, socket.id, 'peerName', {
                peer_id: peer_id_to_update,
                peer_name: peer_name_new,
            });
        }
    });

    /**
     * Relay Audio Video Hand ... Status to peers
     */
    socket.on('peerStatus', (config) => {
        let room_id = config.room_id;
        let peer_name = config.peer_name;
        let element = config.element;
        let status = config.status;
        try {
            for (let peer_id in peers[room_id]) {
                if (peers[room_id][peer_id]['peer_name'] == peer_name) {
                    switch (element) {
                        case 'video':
                            peers[room_id][peer_id]['peer_video'] = status;
                            break;
                        case 'audio':
                            peers[room_id][peer_id]['peer_audio'] = status;
                            break;
                        case 'hand':
                            peers[room_id][peer_id]['peer_hand'] = status;
                            break;
                        case 'rec':
                            peers[room_id][peer_id]['peer_rec'] = status;
                            break;
                    }
                }
            }

            log.debug('[' + socket.id + '] emit peerStatus to [room_id: ' + room_id + ']', {
                peer_id: socket.id,
                element: element,
                status: status,
            });

            sendToRoom(room_id, socket.id, 'peerStatus', {
                peer_id: socket.id,
                peer_name: peer_name,
                element: element,
                status: status,
            });
        } catch (err) {
            log.error('Peer Status', toJson(err));
        }
    });

    /**
     * Relay actions to peers or specific peer in the same room
     */
    socket.on('peerAction', (config) => {
        let room_id = config.room_id;
        let peer_name = config.peer_name;
        let peer_action = config.peer_action;
        let peer_id = config.peer_id;

        if (peer_id) {
            log.debug('[' + socket.id + '] emit peerAction to [' + peer_id + '] from room_id [' + room_id + ']');

            sendToPeer(peer_id, sockets, 'peerAction', {
                peer_name: peer_name,
                peer_action: peer_action,
            });
        } else {
            log.debug('[' + socket.id + '] emit peerAction to [room_id: ' + room_id + ']', {
                peer_id: socket.id,
                peer_name: peer_name,
                peer_action: peer_action,
            });

            sendToRoom(room_id, socket.id, 'peerAction', {
                peer_name: peer_name,
                peer_action: peer_action,
            });
        }
    });

    /**
     * Relay Kick out peer from room
     */
    socket.on('kickOut', (config) => {
        let room_id = config.room_id;
        let peer_id = config.peer_id;
        let peer_name = config.peer_name;

        log.debug('[' + socket.id + '] kick out peer [' + peer_id + '] from room_id [' + room_id + ']');

        sendToPeer(peer_id, sockets, 'kickOut', {
            peer_name: peer_name,
        });
    });

    /**
     * Relay File info
     */
    socket.on('fileInfo', (config) => {
        let room_id = config.room_id;
        let peer_name = config.peer_name;
        let peer_id = config.peer_id;
        let broadcast = config.broadcast;
        let file = config.file;

        function bytesToSize(bytes) {
            let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }

        file['peerName'] = peer_name;

        log.debug('[' + socket.id + '] Peer [' + peer_name + '] send file to room_id [' + room_id + ']', {
            peerName: file.peerName,
            fileName: file.fileName,
            fileSize: bytesToSize(file.fileSize),
            fileType: file.fileType,
            broadcast: broadcast,
        });

        if (broadcast) {
            sendToRoom(room_id, socket.id, 'fileInfo', file);
        } else {
            sendToPeer(peer_id, sockets, 'fileInfo', file);
        }
    });

    /**
     * Abort file sharing
     */
    socket.on('fileAbort', (config) => {
        let room_id = config.room_id;
        let peer_name = config.peer_name;

        log.debug('[' + socket.id + '] Peer [' + peer_name + '] send fileAbort to room_id [' + room_id + ']');
        sendToRoom(room_id, socket.id, 'fileAbort');
    });

    /**
     * Relay video player action
     */
    socket.on('videoPlayer', (config) => {
        let room_id = config.room_id;
        let peer_name = config.peer_name;
        let video_action = config.video_action;
        let video_src = config.video_src;
        let peer_id = config.peer_id;

        let sendConfig = {
            peer_name: peer_name,
            video_action: video_action,
            video_src: video_src,
        };
        let logMe = {
            peer_id: socket.id,
            peer_name: peer_name,
            video_action: video_action,
            video_src: video_src,
        };

        if (peer_id) {
            log.debug(
                '[' + socket.id + '] emit videoPlayer to [' + peer_id + '] from room_id [' + room_id + ']',
                logMe,
            );

            sendToPeer(peer_id, sockets, 'videoPlayer', sendConfig);
        } else {
            log.debug('[' + socket.id + '] emit videoPlayer to [room_id: ' + room_id + ']', logMe);

            sendToRoom(room_id, socket.id, 'videoPlayer', sendConfig);
        }
    });

    /**
     * Whiteboard actions for all user in the same room
     */
    socket.on('wbCanvasToJson', (config) => {
        let room_id = config.room_id;
        // log.debug('Whiteboard send canvas', config);
        sendToRoom(room_id, socket.id, 'wbCanvasToJson', config);
    });

    socket.on('whiteboardAction', (config) => {
        log.debug('Whiteboard', config);
        let room_id = config.room_id;
        sendToRoom(room_id, socket.id, 'whiteboardAction', config);
    });
}); // end [sockets.on-connect]

/**
 * Object to Json
 * @param {object} data object
 * @returns {json} indent 4 spaces
 */
function toJson(data) {
    return JSON.stringify(data, null, 4); // "\t"
}

/**
 * Send async data to all peers in the same room except yourself
 * @param {string} room_id id of the room to send data
 * @param {string} socket_id socket id of peer that send data
 * @param {string} msg message to send to the peers in the same room
 * @param {object} config data to send to the peers in the same room
 */
async function sendToRoom(room_id, socket_id, msg, config = {}) {
    for (let peer_id in channels[room_id]) {
        // not send data to myself
        if (peer_id != socket_id) {
            await channels[room_id][peer_id].emit(msg, config);
            //console.log('Send to room', { msg: msg, config: config });
        }
    }
}

/**
 * Send async data to specified peer
 * @param {string} peer_id id of the peer to send data
 * @param {object} sockets all peers connections
 * @param {string} msg message to send to the peer in the same room
 * @param {object} config data to send to the peer in the same room
 */
async function sendToPeer(peer_id, sockets, msg, config = {}) {
    if (peer_id in sockets) {
        await sockets[peer_id].emit(msg, config);
        //console.log('Send to peer', { msg: msg, config: config });
    }
}
