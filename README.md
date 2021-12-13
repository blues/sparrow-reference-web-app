- [Sparrow Starter](#sparrow-starter)
  - [Deploy on Netlify (recommended)](#deploy-on-netlify-recommended)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Deploy on Microsoft Azure Cloud](#deploy-on-microsoft-azure-cloud)
  - [Development](#development)
    - [Frameworks](#frameworks)
  - [Testing](#testing)

# Sparrow Starter

This is an example webapp to configure and view sensor data from Blues Wireless
Sparrow devices.

## Deploy on Netlify (recommended)

This project is set up to be instantly deployed to
[Netlify](https://netlify.com)! Click the button below to automatically fork
this repo, set environment variables, and deployment on Netlify.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/blues/sparrow-starter)

## Deploy on Vercel

The next easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy on Microsoft Azure Cloud

Note: Running this site as Azure Container Instances will cost about $30/mo.

If you need more details on any of the steps below, see
[Docker and ACI](https://docs.docker.com/cloud/aci-integration/)

Build Machine and Cloud Setup

1. Sign up for [Azure](https://azure.microsoft.com/en-us/)
2. Sign up for [Docker Hub](https://hub.docker.com/signup)
3. Install [Docker](https://docs.docker.com/get-docker/)
4. Install [docker-compose](https://docs.docker.com/compose/install/)
5. Install the confusingly named [Compose
   CLI](https://github.com/docker/compose-cli) which adds cloud-specific
   compose-like support to `docker` via a wrapper of the standard `docker` cli.
6. Check that _Compose CLI_ is working. `docker version | grep 'Cloud integration' && echo Yay || echo Boo`
7. Sign into Azure using `docker login azure` https://docs.docker.com/cloud/aci-integration/
8. Create a docker context on Azure named however you like. `docker context create aci myacicontext`

Configure the _sparrow-starter_ environment

1. `cp .env.local.example .env.production.local`
2. Configure the _Required_ variables and the Azure variables.

Build and Deploy

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

## Development

First, install [Volta](https://docs.volta.sh/guide/getting-started).

Download our dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:4000/api/](http://localhost:4000/api/). This endpoint can be edited in `src/pages/api/*.ts`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Frameworks

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Testing

This repo contains a unit testing that utilizes [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). You can view the tests in the `__tests__` folder, and you can run the full test suite using the command below.

```sh
npm run test
```
