
## Setting a Route from Notehub to your local instance

### ngrok

#### Initial setup
* sign up to ngrok (it's free, up to a point)
* [install ngrok](https://dashboard.ngrok.com/get-started/setup) - I used `brew install ngrok` on OSX
* [setup your ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken)

#### Tunneling your local server to the internet
* run `ngrok http 4000` to create a tunnel to your local hosted Sparrow Starter app
* keep the console open as long as you can. Each time the tunnel is restarted the generated URL changes.

### Create a notehub route in a shared project to your local host site

* select Routes, then click "Create Route" on the right side
* select General HTTP/HTTPS request/response
* name the route, e.g. "<yourname> sparrow starter datastore" 
* the URL of the route is the forwarded https url from ngrok, with the path `/api/datastore/ingest` for example
    ```
    https://aaab-73-92-215-121.ngrok.io/api/datastore/ingest
    ```
* When sensors post sensor events you should see the event body written to the console. This is just for the PoC. 