# Storedog Frontend

This is a NextJS application that relies on [Storedog - Backend](https://github.com/DataDog/storedog-backend) for all API requests.

## Local dev

**1.** Before starting the containers, you will need to define the required env vars. Run the following command to copy the env var template to the `.env.local` file:

`cp .env.template ./services/frontend/site/.env.local`

Then, open the `.env.local` file and enter the values for the variables. The default values should all work except for the empty `NEXT_PUBLIC_DD_APPLICATION_KEY` and `NEXT_PUBLIC_CLIENT_TOKEN`, which are required to enable RUM.

**2.** Start the backend by following the instructions [here](https://github.com/DataDog/storedog-backend#local-development) 

**3a.** To start the fronted using the local build context, run:
`docker-compose up`

**3b.** To start the frontend using the published images in ECR, run:
`docker-compose -f ./deploy/docker-compose/docker-compose.yml up`


### Note
The services are linked by a shared network `storedog-backend_storedog-net` which is defined in the [Storedog - Backend](https://github.com/DataDog/storedog-backend) `docker-compose.yml` file.

> If you encounter any problems while installing and running for the first time, please see the Troubleshoot section

## Considerations

- `packages/commerce` contains all types, helpers and functions to be used as base to build a new **provider**.
- **Providers** live under `packages`'s root folder and they will extend Next.js Commerce types and functionality (`packages/commerce`).
- We have a **Features API** to ensure feature parity between the UI and the Provider. The UI should update accordingly and no extra code should be bundled. All extra configuration for features will live under `features` in `commerce.config.json` and if needed it can also be accessed programatically.
- Each **provider** should add its corresponding `next.config.js` and `commerce.config.json` adding specific data related to the provider. For example in case of BigCommerce, the images CDN and additional API routes.

## Configuration

### Enable RUM

To enable RUM, generate a new RUM application in DD and then set the `NEXT_PUBLIC_DD_APPLICATION_KEY` and `NEXT_PUBLIC_CLIENT_TOKEN` values in `./site/.env.local`. Then start the app, click around the site, and you should start to see RUM metrics populating in DD.

### Features

Every provider defines the features that it supports under `packages/{provider}/src/commerce.config.json`

#### Features Available

The following features can be enabled or disabled. This means that the UI will remove all code related to the feature.
For example: Turning `cart` off will disable Cart capabilities.

- cart
- search
- wishlist
- customerAuth
- customCheckout

#### How to turn Features on and off

> NOTE: The selected provider should support the feature that you are toggling. (This means that you can't turn wishlist on if the provider doesn't support this functionality out the box)

- Open `site/commerce.config.json`
- You'll see a config file like this:
  ```json
  {
    "features": {
      "wishlist": false,
      "customCheckout": true
    }
  }
  ```
- Turn `wishlist` on by setting `wishlist` to `true`.
- Run the app and the wishlist functionality should be back on.

## Troubleshoot

<details>
<summary>When run locally I get `Error: Cannot find module '...@vercel/commerce/dist/config'`</summary>

```bash
commerce/site
❯ yarn dev
yarn run v1.22.17
$ next dev
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
info  - Loaded env from /commerce/site/.env.local
error - Failed to load next.config.js, see more info here https://nextjs.org/docs/messages/next-config-error
Error: Cannot find module '/Users/dom/work/vercel/commerce/node_modules/@vercel/commerce/dist/config.cjs'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:960:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:953:15)
    at resolveExports (node:internal/modules/cjs/loader:482:14)
    at Function.Module._findPath (node:internal/modules/cjs/loader:522:31)
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:919:27)
    at Function.mod._resolveFilename (/Users/dom/work/vercel/commerce/node_modules/next/dist/build/webpack/require-hook.js:179:28)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/Users/dom/work/vercel/commerce/site/commerce-config.js:9:14) {
  code: 'MODULE_NOT_FOUND',
  path: '/Users/dom/work/vercel/commerce/node_modules/@vercel/commerce/package.json'
}
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

The error usually occurs when running yarn dev inside of the `/site/` folder after installing a fresh repository.

In order to fix this, run `yarn dev` in the monorepo root folder first.

> Using `yarn dev` from the root is recommended for developing, which will run watch mode on all packages.

</details>

<details>
<summary>When run locally I get `Error: Spree API cannot be reached'`</summary>

The error usually occurs when the backend containers are not yet fully healthy, but the frontend has already started making API requests.

In the docker logs output for storedog-backend, check to see if the backend has fully started. You should see the following log for the `web` container:
```
web_1       | [1] * Listening on http://0.0.0.0:4000
```

</details>
