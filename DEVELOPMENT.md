# Development Documentation

This document contains information on development processes needed to run the Sparrow Reference Web App.

## Setting up a Local Data Store

In development, the Sparrow Reference Web App uses a local database to store information on gateways and sensor nodes.

To set up your own local database you must:

1) [Create a tunnel to a server running the reference app.](#create-a-tunnel-to-a-server-running-the-reference-app)
    * Running the tunnel allows your local copy of the reference app to be accessible on the public internet. This is necessary for Notehub to route events to your local setup.

2) [Set up a Notehub route to your tunnel.](#set-up-a-notehub-route-to-your-tunnel)
    * When Notehub receives an event it can optionally route that event to other servers. In this step, you’ll have Notehub route events to your local setup via the tunnel you created in step #1.

3) [Create a local Postgres database.](#create-a-local-postgres-database)
    * The reference app uses a Postgres database to store the data it receives from Notehub. In this step you’ll set that up.

### Create a tunnel to a server running the reference app

The Sparrow reference app contains logic to processes incoming Notehub events. But in order for Notehub to forward data to your local app for processing, your local app must be accessible from the public internet.

To make your local environment accessible you must set up a tunnel. You’re welcome to use any tunneling setup you’re comfortable using, but we recommend [ngrok](https://ngrok.com/).

To use ngrok you’ll first need to:

* [Sign up for ngrok](https://dashboard.ngrok.com/signup). (It’s free to start.)
* [Install ngrok](https://dashboard.ngrok.com/get-started/setup). (`brew install ngrok` works well for macOS users.)
* [Set up your ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken).

With ngrok set up, return to your Sparrow reference app and run `yarn dev` to start up the app.

```
yarn dev
```

Next, open a new terminal tab or window and run `ngrok http 4000`, which creates the tunnel itself.

```
ngrok http 4000
```

If all went well, you should see a screen in your terminal that looks like the image below. ngrok is all now forwarding all requests to `https://<your-id>.ngrok.io` to `http://localhost:4000`. Copy the forwarding address (shown in the red box below) to your clipboard, as you’ll need it in the next step.

![Example of ngrok running](https://user-images.githubusercontent.com/544280/161281285-0b20f600-3c88-4c81-98ea-aef7665f59d7.png)

> **NOTE**: Your `ngrok` terminal needs to stay running for the tunnel to remain active. If you close and restart `ngrok` your URL will change.

To verify everything worked correctly, you can try loading the URL you just copied in a web browser; you should see your reference app’s home page.

### Set up a Notehub route to your tunnel

With a tunnel in place, your next step is to create a route in Notehub that forwards events to your local app.

To set up the route complete the following steps:

* Visit [Notehub](https://notehub.io) and open the project you’re using for your Sparrow app.
* Select **Routes** in the navigation on the left-hand side of the screen.
* Click the **Create Route** link in the top right of the screen.
* Find the **General HTTP/HTTPS Request/Response** route type, and click its **Select** button.
* Give your route a name.
* For the route **URL**, paste the ngrok URL you copied earlier, and append `/api/datastore/ingest`. For example your route should look something like `https://bb18-217-180-218-163.ngrok.io/api/datastore/ingest`.
* Click the blue **Create new Route** button.

And with that your route is now complete. When Notehub receives an event it should automatically route that event to your tunnel, and ultimately to your local app.

> **NOTE** Event routing only happens when Notehub receives an event—therefore, your Sparrow hardware needs to generate new data and send it to Notehub for Notehub to invoke your route.

Now that you have both a tunnel and route in place, your last step to get up and running is to create the database itself.

### Create a local Postgres database

The Sparrow reference app uses Postgres to store data it receives from Notehub events. To set up your own Postgres instance you need to complete the following steps.

1) [Create the database](#create-the-database).
2) [Set environment variables](#set-environment-variables).
3) [Seed and update the data store](#seed-and-update-the-data-store).

#### Create the database

There are many different ways you might want to create a Postgres database. If you’re unsure how to start, we recommend running Postgres through Docker.

To do so, you’ll want to start by [installing Docker](https://docs.docker.com/get-docker/) if you haven’t already.

Next, open a terminal and run the following command (switching out “somePassword” to a password of your choice).

```
docker run --rm \
  -d \
  --name postgresql-container \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=somePassword \
  -v ~/pgdata:/var/lib/postgresql/data \
  postgres
```

> **NOTE**:
> * The above command creates a database that persists the data after container shuts down. Specifically, the `-v` flag tells Docker to mount a volume at the path specified.
> * If you’re running on Windows you’ll need to [change the path for the `-v` option to a Windows-friendly path](https://docs.docker.com/engine/reference/commandline/run/#mount-volume--v---read-only).

This creates a Postgres database running in Docker. If you return to your Docker app you can verify that the container is running as expected.

![Postgres running in Docker](https://user-images.githubusercontent.com/544280/161319618-fe2feab2-0c49-4645-9c8a-57f6c428309b.png)

#### Set environment variables

The Sparrow reference app provides a series of scripts to help you initialize and seed a Postgres database. In order to run, the scripts require two variables to be set on your system.

* `HUB_PROJECTUID`: The UID of the Notehub project that contains your Sparrow data.
* `DATABASE_URL`: The URL of your Postgres database.

You can set these two variables using the `export` command on macOS/Linux, and the [`set` command on Windows](https://www.prisma.io/docs/guides/development-environment/environment-variables/managing-env-files-and-setting-variables#manually-set-an-environment-variable-on-a-windows-system). Start by running the following command in your terminal.

```
export DATABASE_URL=postgres://postgres:somePassword@0.0.0.0:5432/postgres
```

And then run the following command, making sure to swap in your own Notehub project’s UID.

```
export HUB_PROJECTUID=app:123-456-7890
```

#### Seed and update the data store

With the environment variables in place, your last step is to run a few scripts packaged with the reference app to get your database ready to go.

First run `yarn run db:reset`, which resets that datastore and generates all tables.

```
yarn run db:reset
```

Next, run `yarn run db:init` to seed the datastore.

```
yarn run db:init
```

And finally, run `yarn run db:update` to update the datastore schema.

```
yarn run db:update
```
