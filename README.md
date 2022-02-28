# 🐦 Sparrow Starter

An example web application to configure and view sensor data from Blues Wireless Sparrow devices.

- [🐦 Sparrow Starter](#-sparrow-starter)
  - [Setup](#setup)
    - [Clone This Repository](#clone-this-repository)
    - [Environment Variables](#environment-variables)
      - [HUB_AUTH_TOKEN](#hub_auth_token)
      - [HUB_DEVICE_UID](#hub_device_uid)
      - [HUB_PROJECTUID](#hub_projectuid)
    - [Dependencies](#dependencies)
  - [Development](#development)
  - [Testing](#testing)
    - [Testing with Jest](#testing-with-jest)
    - [Testing with Cypress](#testing-with-cypress)
  - [Deploying](#deploying)
    - [Deploy on Netlify (recommended)](#deploy-on-netlify-recommended)
    - [Deploy on Vercel](#deploy-on-vercel)
    - [Deploy on Microsoft Azure Cloud](#deploy-on-microsoft-azure-cloud)
  - [Known Issues](#known-issues)
  - [Support](#support)

## Setup

To get started with running the Sparrow starter you need to:

- [Create a Notehub account](https://dev.blues.io/notehub/notehub-walkthrough/) if you don't already have one.
- [Create a Notehub project](https://dev.blues.io/notehub/notehub-walkthrough/#create-a-new-project) for your Sparrow devices.
- [Set up a Sparrow Gateway and one or more sensors](https://blueswireless.notion.site/Sparrow-Setup-and-Run-Guide-302725d84d9642b9b274e087881134a8).
- [Clone this repository](#clone-this-repository) to your local development environment.
- Configure the starter app’s Notehub settings via [environment variables](#environment-variables).
- Install the project’s development [dependencies](#dependencies).
- Launch the Sparrow Starter app in [development mode](#development).

### Clone This Repository

To start using the Sparrow starter you must clone this repository to your local development machine. You can do this with `git clone`.

```
git clone https://github.com/blues/sparrow-starter.git
```

Next, change directories to the `sparrow-starter` folder, as that’s where you’ll need to run all subsequent commands.

```
cd sparrow-starter
```

With your local project downloaded, you’ll next want to open up the `sparrow-starter` folder in your text editor or IDE of choice. Once you have the project open in your editor you’re ready to configure the project’s environment variables.

### Environment Variables

The Sparrow starter uses a series of environment variables to store project-specific configuration. You _must_ define your own values for these variables for the Sparrow starter to run. You can follow the following steps to do so.

1. Create a `.env.local` file in the root of your project.
1. Copy the contents of this repo’s [.env.local.example](.env.local.example) file, and paste it into your new `.env.local` file.
1. Change the required values in your `.env.local` to your own values using the steps below.

#### HUB_AUTH_TOKEN

The Sparrow starter app needs access to your Notehub project in order to show the gateway and sensors in your project. An access token is used to authenticate the app.

To find retrieve an authentication token, put this in your command line, replacing `YOUR_NOTEHUB_EMAIL` & `NOTEHUB_PASSWORD` with your own:

```
curl -X POST -L 'https://api.notefile.net/auth/login' \
    -d '{"username":"YOUR_NOTEHUB_EMAIL", "password": "NOTEHUB_PASSWORD"}'
```

When successful, you will see a response like

```
{"session_token":"BYj0bhMJwd3JucXE18f14Y3zMjQIoRfD"}
```

Copy the value after the colon to set the environment variable in `.env.local`, e.g.

```
HUB_AUTH_TOKEN=BYj0bhMJwd3JucXE18f14Y3zMjQIoRfD
```

#### HUB_DEVICE_UID

This is the unique identifier for your Sparrow Gateway’s Notecard device. You can find this by going to your Notehub project, clicking the **Devices** menu, and then double clicking your gateway in the list of devices.

```
HUB_DEVICE_UID=dev:038050040065363
```

For a project with multiple gateways, you can provide a comma separated list of device IDs.

```
HUB_DEVICE_UID=dev:038050040065363,dev:038050040065364,dev:038050040065365
```

#### HUB_PROJECTUID

This is the unique identifier for your project in Notehub, and has the prefix `app:`. You can find this by going to your Notehub project, clicking the **Settings** menu, and then scrolling down to the **Project UID** heading.

```
HUB_PROJECTUID=app:245dc5d9-f910-433d-a8ca-c66b35475689
```

### Dependencies

The Sparrow starter uses [Node.js](https://nodejs.org/en/) as a runtime, [Yarn](https://yarnpkg.com/) as a package manager, and [Volta](https://volta.sh/) as a way of enforcing consistent versions of all JavaScript-based tools. You can install these dependencies by following the steps below.

1. Install Volta by following [its installation instructions](https://docs.volta.sh/guide/getting-started).
2. Run the command below in a terminal to install the appropriate versions of both Node.js and Yarn.

```
volta install node yarn
```

3. Navigate to the root of the Sparrow starter in your terminal or command prompt and run `yarn install`, which installs the starter’s npm dependencies.

```
yarn install
```

With your environment variables set and dependencies installed, you’re now ready to start developing.

## Development

The Sparrow Starter is built on top of [Next.js](https://nextjs.org/). You can start a Next.js development server using `yarn dev`.

```
yarn dev
```

With the development server running, open <http://localhost:4000> in your web browser to see your application.

Next.js automatically watches your project’s files, and updates your application as you make changes. To try it, open your app’s `src/pages/index.tsx` file, make a change, save the file, and notice how your browser automatically updates with the change.

The project’s `src/pages/api` directory are [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. The Sparrow starter uses these routes in several places to access the [Notehub API](https://dev.blues.io/reference/notehub-api/api-introduction/).

> **NOTE**: If you’re new to Next.js, the [Next.js official interactive tutorial](https://nextjs.org/learn/basics/create-nextjs-app) is a great way to learn the basics, and understand how the Sparrow starter works.

## Testing

The Sparrow starter contains both unit and end-to-end tests to ensure the project continues to work as intended.

### Testing with Jest

This repo contains a unit testing setup that utilizes [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). No additional installation is necessary to use these tools (`yarn install` already installed them), but there is some additional setup you must perform to run the tests.

**Unit Test Setup**

The Sparrow starter’s testing setup requires a test-specific environment variable file. Follow the steps below to create that file.

1. Create a `.env.test.local` file in the root of your project.
1. Copy the contents of the repo’s [`.env.test.local.example`](.env.test.local.example) file and paste it into your `.env.test.local` file.
1. Change the values in your `.env.test.local` file to your own values. (You can likely copy and paste them from your `.env.local` file.)

**Running Unit Tests**

This repo’s tests live in its `__tests__` folder, and you can run the full test suite using the command below.

```bash
yarn test
```

**Code Coverage from Unit Tests**

To see code coverage for the entire project, run the following command.

```bash
yarn test:coverage
```

When the command finishes, you can open the coverage report by opening the repo’s `coverage/lcov-report/index.html` file in your web browser. You can do so on macOS using the command below.

```bash
open coverage/lcov-report/index.html
```

### Testing with Cypress

The Sparrow starter uses [Cypress](https://www.cypress.io/) for automated UI & API testing.

**Cypress Setup**

To run the project’s Cypress tests you first need to perform the following setup.

1. Create a `cypress.env.json` file in the root of your project.
2. Copy and paste the code below into your newly created file.

```
{
  "gatewayUID": "dev:###############"
}
```

3. Change the placeholder `"dev:###############"` value to a valid gateway UID.

**Running Cypress Tests**

You can run the Cypress test suite with the `yarn cypress` command. `yarn cypress:run` runs the tests in your terminal.

```bash
yarn cypress:run
```

And `yarn cypress:open` launches the tests in the Cypress GUI.

```bash
yarn cypress:open
```

## Deploying

The Sparrow starter is a Next.js project, and is therefore easily deployable to any platform that supports Next.js applications. Below are specific instructions to deploy to a handful of common platforms.

> **NOTE**: For all deployment options we recommend [creating a fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) of this repository, and performing all deployment steps on that fork.

### Deploy on Netlify (recommended)

This repo contains [Netlify configuration](netlify.toml) that allows you to deploy to [Netlify](https://www.netlify.com/) with a simple button click! Click the button below to automatically fork this repo, set environment variables, and immediately to deploy to Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/blues/sparrow-starter)

Read our step-by-step guide to [deploying the Sparrow starter app on Netlify](https://blueswireless.notion.site/Deploy-Sparrow-Starter-using-Netlify-0fc1e6bbccd84a0d8a9542ec00ef245f) for more information.

### Deploy on Vercel

The next easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Read our step-by-step guide to [deploying the Sparrow starter app on Vercel](https://blueswireless.notion.site/Deploy-Sparrow-Starter-using-Vercel-c1b668dff4a24f268f3c277d8ee5e8f4) for more information.

### Deploy on Microsoft Azure Cloud

> **NOTE**: Running this site as Azure Container Instances will cost about $30/mo.

Follow the steps below to deploy to [Microsoft Azure Cloud](https://azure.microsoft.com/en-us/). If you need more details on any of the steps, see
[Docker’s documentation on deploying Docker containers on Azure](https://docs.docker.com/cloud/aci-integration/).

**Build Machine and Cloud Setup**

1. Sign up for [Azure](https://azure.microsoft.com/en-us/).
1. Sign up for [Docker Hub](https://hub.docker.com/signup).
1. Install [Docker](https://docs.docker.com/get-docker/).
1. Install [docker-compose](https://docs.docker.com/compose/install/).
1. Install the confusingly named [Compose
   CLI](https://github.com/docker/compose-cli), which adds cloud-specific
   compose-like support to `docker` via a wrapper of the standard `docker` cli.
1. Check that _Compose CLI_ is working. `docker version | grep 'Cloud integration' && echo Yay || echo Boo`.
1. Sign into Azure using `docker login azure`. See <https://docs.docker.com/cloud/aci-integration/>.
1. Create a docker context on Azure named however you like. For example, `docker context create aci myacicontext`.

**Configure the _sparrow-starter_ environment**

1. `cp .env.local.example .env.production.local`
2. Configure the _Required_ variables and the Azure variables.

**Build and Deploy**

`./deploy.sh`

```
...
[+] Running 3/3
 ⠿ Group sparrow-starter                   Created    6.3s
 ⠿ sparrowstartersite-https-reverse-proxy  Created    113.8s
 ⠿ sparrowstartersite                      Created    113.8s
[deploy.sh] 🚀 Successful deployment.
[deploy.sh] 🔃 To deploy new changes, simply run this script again.
[deploy.sh] 🚮 To delete the deployment or see cloud details, visit the Azure Portal: https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ContainerInstance%2FcontainerGroups
[deploy.sh] ⏰ In a few minutes the site should be visible here:
[deploy.sh] 🔜 https://mysparrowstarer.eastus.azurecontainer.io
```

## Known Issues

**Performance**

As the number of devices and readings increase, the loading time of the Sparrow starter’s pages increases as well. We are addressing this for the GA release.

**Unable to change gateway name**

Currently you cannot change the name of a gateway through the Sparrow starter user interface. If you would like to update a gateway’s name complete the following steps:

1. Visit [Notehub](https://notehub.io) and open your project.
1. Click **Devices** menu in the menu to view all devices on your project.
1. Locate the device you would like to update in the device list, and double click it.
1. Click the **Environment** tab to view the device’s environment variables.
1. Update the value of the `_sn` environment variable to your new name.
1. Click the **Save** button to save the name update.

If you have the Sparrow starter already open you’ll have to refresh to see the name update in the UI. We are adding the ability to change a gateway’s name and environment variables for the GA release.

**Incorrect “Last updated” date**

Currently sensors may display an incorrect “Last updated” date or time. You can see the sensor’s correct last-updated time by looking at the most recent reading on the sensor’s detail page. We are addressing this issue for the GA release.

## Support

If you run into any issues using this repo, feel free to [create an issue](/issues), or to [reach out on our developer forum](https://discuss.blues.io/).
