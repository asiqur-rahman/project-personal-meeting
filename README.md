# <p align="center">BrainTechSolution P2P</p>

<p align="center">Free WebRTC - P2P - Simple, Secure, Fast Real-Time Video Conferences Up to 4k and 60fps, compatible with all browsers and platforms.</p>

<hr />

<p align="center">
    <a href="https://p2p.braintechsolution.com">p2p.braintechsolution.com</a>
</p>

<hr />

<p align="center">
    <a href="https://p2p.braintechsolution.com"><img src="public/images/braintechsolution-header.gif"></a>
</p>

<hr />

<details>
<summary>Features</summary>

<br/>

-   Is `100% Free` - `Open Source` - `Self Hosted`
-   No download, plug-in, or login required, entirely browser-based
-   Unlimited number of conference rooms without call time limitation
-   Translated in 133 languages
-   Possibility to Password protect the Room for the meeting
-   Desktop and Mobile compatible
-   Optimized Room URL Sharing (share it to your participants, wait for them to join)
-   Webcam Streaming (Front - Rear for mobile)
-   Audio Streaming crystal clear with detect speaking and volume indicator
-   Screen Sharing to present documents, slides, and more...
-   File Sharing (with drag-and-drop), share any files to your participants in the room
-   Select Audio Input - Output && Video source
-   Ability to set video quality up to 4K and 60 FPS
-   Recording your Screen, Audio and Video
-   Snapshot the video frame and save it as image png
-   Chat with Emoji Picker & Private messages & Save the conversations
-   Speech recognition to send the speeches
-   Advance collaborative whiteboard for the teachers
-   Share any YT Embed video in real-time
-   Full-Screen Mode on mouse click on the Video element
-   Possibility to Change UI Themes
-   Right-click on the Video elements for more options
-   Direct `peer-to-peer` connection ensures the lowest latency thanks to `WebRTC`
-   Supports [REST API](app/api/README.md) (Application Programming Interface)
-   [Slack](https://api.slack.com/apps/) API integration
-   [Sentry](https://sentry.io/) error reporting

</details>

<details>
<summary>Presentation</summary>

<br/>

<a href="https://www.canva.com/design/DAE693uLOIU/view">BrainTechSolution presentation </a> - <a href="https://www.youtube.com/watch?v=_IVn2aINYww">video</a>

</details>

<details>
<summary>Start videoconference</summary>

<br/>

-   `Open` https://p2p.braintechsolution.com/newcall or
-   https://braintechsolution.up.railway.app/newcall or
-   https://braintechsolution.herokuapp.com/newcall
-   `Pick` your Room name and Join
-   `Allow` using the camera and microphone
-   `Share` the Room URL and Wait for someone to join for the video conference

</details>

<details>
<summary>Direct Join</summary>

<br/>

-   You can `join` directly to `room` by going to:
-   https://p2p.braintechsolution.com/join?room=test&name=braintechsolution&audio=0&video=0&screen=0&notify=0
-   https://braintechsolution.up.railway.app/join?room=test&name=braintechsolution&audio=0&video=0&screen=0&notify=0
-   https://braintechsolution.herokuapp.com/join?room=test&name=braintechsolution&audio=0&video=0&screen=0&notify=0

    | Params | Type    | Description     |
    | ------ | ------- | --------------- |
    | room   | string  | room Id         |
    | name   | string  | user name       |
    | audio  | boolean | audio stream    |
    | video  | boolean | video stream    |
    | screen | boolean | screen stream   |
    | notify | boolean | welcome message |

</details>

<details>
<summary>Embed a meeting</summary>

<br/>

Embedding a meeting into a service or app using an iframe.

```html
<iframe
    allow="camera; microphone; fullscreen; display-capture; autoplay"
    src="https://braintechsolution.herokuapp.com/newcall"
    style="height: 100%; width: 100%; border: 0px;"
></iframe>
```

</details>

<details open>
<summary>Quick start</summary>

<br/>

-   You will need to have `Node.js` installed, this project has been tested with Node versions [12.X](https://nodejs.org/en/blog/release/v12.22.1/), [14.X](https://nodejs.org/en/blog/release/v14.17.5/) and [16.X](https://nodejs.org/en/blog/release/v16.15.0/).

```bash
# clone this repo
$ git clone https://github.com/miroslavpejic85/braintechsolution.git
# go to braintechsolution dir
$ cd braintechsolution
# copy .env.template to .env
$ cp .env.template .env
# install dependencies
$ npm install
# start the server
$ npm start
```

-   Open http://localhost:3000 in browser

</details>

<details open>
<summary>Docker</summary>

<br/>

-   Install docker engine: https://docs.docker.com/engine/install/
-   Install docker compose: https://docs.docker.com/compose/install/

```bash
# copy .env.template to .env
$ cp .env.template .env
# build or rebuild services
$ docker-compose build
# create and start containers
$ docker-compose up # -d
# stop and remove resources
$ docker-compose down
```

-   Open http://localhost:3000 in browser

</details>

<details>
<summary>Ngrok - Https</summary>

<br/>

You can start videoconferencing directly from your Local PC, and be reachable from any device outside your network, simply by following [these documentation](docs/ngrok.md), or expose it directly on [HTTPS](app/ssl/README.md)

</details>

<details>
<summary>Setup Turn</summary>

<br/>

`Recommended`, for more info about the Turn check out [here](https://webrtc.org/getting-started/turn-server). Just edit [this part](https://github.com/miroslavpejic85/braintechsolution/blob/master/.env.template#L9) on your `.env`.

</details>

<details>
<summary>Rest API</summary>

<br/>

```bash
# The response will give you a entrypoint / Room URL for your meeting, where authorization: API_KEY_SECRET.
$ curl -X POST "http://localhost:3000/api/v1/meeting" -H "authorization: braintechsolution_default_secret" -H "Content-Type: application/json"
$ curl -X POST "https://p2p.braintechsolution.com/api/v1/meeting" -H "authorization: braintechsolution_default_secret" -H "Content-Type: application/json"
$ curl -X POST "https://braintechsolution.up.railway.app/api/v1/meeting" -H "authorization: braintechsolution_default_secret" -H "Content-Type: application/json"
$ curl -X POST "https://braintechsolution.herokuapp.com/api/v1/meeting" -H "authorization: braintechsolution_default_secret" -H "Content-Type: application/json"
```

## API Documentation

The API documentation uses [swagger](https://swagger.io/) at http://localhost:3000/api/v1/docs. Or check it out on [live](https://p2p.braintechsolution.com/api/v1/docs) & [heroku](https://braintechsolution.herokuapp.com/api/v1/docs).

</details>

<details open>
<summary>Hetzner</summary>

<br/>

[![Hetzner](public/sponsors/Hetzner.png)](https://www.hetzner.com)

This application is running for `demonstration purposes` on [Hetzner](https://www.hetzner.com/), one of `the best` [cloud providers](https://www.hetzner.com/cloud) and [dedicated root servers](https://www.hetzner.com/dedicated-rootserver).

If you need help to deploy `BrainTechSolution P2P` instance on `your dedicated cloud server`, or for other needs, don't hesitate to contact us at p2p.braintechsolution@gmail.com

</details>

<details>
<summary>Live Demos</summary>

<br/>

<a target="_blank" href="https://p2p.braintechsolution.com"><img src="public/sponsors/Hetzner.png" style="width: 220px;"></a>

https://p2p.braintechsolution.com

[![hetzner-qr](public/images/braintechsolution-hetzner-qr.png)](https://p2p.braintechsolution.com)

<br>

<a target="_blank" href="https://railway.app/new/template/braintechsolution?referralCode=braintechsolution"><img src="https://railway.app/button.svg" style="width: 220px;"></a>

https://braintechsolution.up.railway.app

[![railway-qr](public/images/braintechsolution-railway-qr.png)](https://braintechsolution.up.railway.app)

<br>

<a href="https://heroku.com/deploy?template=https://github.com/miroslavpejic85/braintechsolution"><img src="https://www.herokucdn.com/deploy/button.svg" style="width: 220px;" alt="Heroku Deploy"></a>

https://braintechsolution.herokuapp.com

[![heroku-qr](public/images/braintechsolution-heroku-qr.png)](https://braintechsolution.herokuapp.com)

If you want to deploy a BrainTechSolution P2P instance on your dedicated server, or for other needs, don't hesitate to contact us at p2p.braintechsolution@gmail.com.

</details>

<details>
<summary>Self Hosting</summary>

<br/>

Follow [this documentation](docs/self-hosting.md).

</details>

<details>
<summary>Credits</summary>

<br/>

-   ianramzy (html [template](https://cruip.com/demos/neon/))
-   vasanthv (webrtc-logic)
-   fabric.js (whiteboard)

</details>

<details>
<summary>Contributing</summary>

<br/>

-   Contributions are welcome and greatly appreciated!
-   Just run before `npm run lint`

</details>

<details>
<summary>Discussions and support</summary>

<br/>

-   For discussions, help & support, join with us on [Discord](https://discord.gg/rgGYfeYW3N)

</details>

<details>
<summary>License</summary>

<br/>

[![AGPLv3](public/images/AGPLv3.png)](LICENSE)

BrainTechSolution is free and can be modified and forked. But the conditions of the AGPLv3 (GNU Affero General Public License v3.0) need to be respected. In particular modifications need to be free as well and made available to the public. Get a quick overview of the license at [Choose an open source license](https://choosealicense.com/licenses/agpl-3.0/).

For a BrainTechSolution license under conditions other than AGPLv3, please contact us at info.braintechsolution@gmail.com.

</details>

<details open>
<summary>Support the project</summary>

<br/>

Do you find BrainTechSolution useful?

Support the project by [becoming a backer or sponsor](https://github.com/sponsors/miroslavpejic85). Your logo will show up here with a link to your website.

[![BroadcastX](public/sponsors/BroadcastX.png)](https://broadcastx.de/)

[![Hetzner](public/sponsors/Hetzner.png)](https://www.hetzner.com)

</details>

<br>

<details>
<summary>BrainTechSolution SFU</summary>

<br/>

Try also [BrainTechSolution SFU](https://github.com/miroslavpejic85/braintechsolutionsfu), the difference between the two projects you can found [here](https://github.com/miroslavpejic85/braintechsolutionsfu/issues/14#issuecomment-932701999).

</details>
