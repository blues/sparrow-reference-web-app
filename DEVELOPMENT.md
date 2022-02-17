
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


### Prisma

We're storing environment variables in `.env.local` so that secrets aren't checked in to version control. This creates a problem for
the prisma client, which wants to load only `.env`.  

This currently only applies to the `DATABASE_URL` environment variable.

We have two options to fix this:

1. use `export` to set the environment variable.
2. use `dotenv` - https://www.prisma.io/docs/guides/development-environment/environment-variables/managing-env-files-and-setting-variables 

### PostgreSQL 

#### Visual Studio Code

*  `PostgreSQL` extension by Microsoft for command line access.

* [Visual Database explorer](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2) extension, but
I couldn't get it to connect using the credentials from Heroku.

* using pgAdmin 
    1. create a new connection
    1. fill in the fields on the `connection` tab
    1. on the `Advanced` tab, add the database name to `DB Restriction` to show only our database, otherwise you'll see thousands of databases in the database list.