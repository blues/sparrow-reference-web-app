This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:4000/api/hello](http://localhost:4000/api/hello). This endpoint can be edited in `src/pages/api/hello.ts`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Testing

This repo contains a unit testing that utilizes [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). You can view the tests in the `__tests__` folder, and you can run the full test suite using the command below.

```
npm run test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Netlify (recommended)

[![Netlify Status]()]()

This [Next.js](https://nextjs.org/) project is set up to be instantly deployed
to [Netlify](https://netlify.com)!

### Deployment options

**Option one:** One-click deploy

(If you click this button, it will create a new repo for you that looks exactly
like this one, and sets that repo up immediately for deployment on Netlify)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/blues/sparrow-starter)

**Option two:** Manual clone

1. Clone this repo: `git clone https://github.com/netlify-templates/next-netlify-starter.git`
2. Navigate to the directory and run `npm install`
3. Run `npm run dev`
4. Make your changes
5. Connect to [Netlify](https://netlify.com/) manually (the `netlify.toml` file
   is the one you'll need to make sure stays intact to make sure the export is
   done and pointed to the right stuff)

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
9. Activate the new context `docker context use myacicontext`

Configure the _sparrow-starter_ environment

1. `cp .env.local.example .env.production.local`
2. Configure the _Required_ variables and the Azure variables.

Build Dockerfile.prod and Deploy

`./deploy.sh`
