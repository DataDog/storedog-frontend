# Storedog Frontend

This is a NextJS application that relies on [Storedog - Backend](https://github.com/DataDog/storedog-backend) for all API requests.

## Local dev

> To run a minimal version of Next.js Commerce you can start with the default local provider `@vercel/commerce-local` that has disabled all features (cart, auth) and use static files for the backend.


```bash
cp ./packages/local/.env.template ./site/.env.local # copy the default 'local' config into the site folder so the app knows what backend to use
yarn # install packages
yarn dev # start app
```

Alternatively, you can run the entire app (frontend + backend) locally via Docker.

1. Start the backend by cloning the [Storedog - Backend](https://github.com/DataDog/storedog-backend) repo and running `docker-compose up`
2. Start the frontend by cloning this repo and running the same command: `docker-compose up`

The services are linked by a shared network `storedog-backend_storedog-net` which is defined in the [Storedog - Backend](https://github.com/DataDog/storedog-backend) `docker-compose.yml` file.

> If you encounter any problems while installing and running for the first time, please see the Troubleshoot section

## Considerations

- `packages/commerce` contains all types, helpers and functions to be used as base to build a new **provider**.
- **Providers** live under `packages`'s root folder and they will extend Next.js Commerce types and functionality (`packages/commerce`).
- We have a **Features API** to ensure feature parity between the UI and the Provider. The UI should update accordingly and no extra code should be bundled. All extra configuration for features will live under `features` in `commerce.config.json` and if needed it can also be accessed programatically.
- Each **provider** should add its corresponding `next.config.js` and `commerce.config.json` adding specific data related to the provider. For example in case of BigCommerce, the images CDN and additional API routes.

## Configuration

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
