# Next.js training

Course here: https://hendrixer.github.io/nextjs-course/

## Notes

### Routing 
Routing is enforced via a file/folder structure inside the `/pages` directory.  These files should export a react component which is what will be rendered when navigating to that page.  For example, `/pages/notes/index.js` is what will render when you go to `/notes`.

__Parameters__
To create a route that accepts a single parameter, put the parameter name in square brackets as the filename.  So `/pages/notes/[id].js` is responsible for /notes/:id routes.  That named parameter (in this case `id`) gets passed to the render function of the component exported by the `[id].js` file.

To create a route that accepts multiple parameters, you can use a catch-all route.  This would be something like `/pages/docs/[...params].js`.  This means that all route parameters after `/docs` will be captured and passed to the component.  So `/docs/abc/123/snarf` would pass `['abc', '123', 'snarf']` to the component.

### Navigation
There is a `<Link>` component provided in the `next/link` module.  __It's only for client-side history navigation__.  Otherwise, you can just use an `<a>`.

### Styling
Global CSS, just traditional stylesheets that are loaded on the page, can only be done in one place in Next.js, the `pages/_app.js` file.  This is what is used as the entry point to your app, and you can add global CSS imports here.  This is useful when you need to import CSS from a third party module.

__CSS Modules__
Write CSS for particular components, those styles get bundled at build time into generated classes, and those classes are applied to the React components.  This is where most if not all of your styles should be.

To use CSS modules, you can create a `[name].module.less` file anywhere and write some scoped css.  If that file has a `.success` class rule, then you can do this:

```less
// styles.module.less
.success {
  color: green;
}
```

```js
import styles from 'styles.module.less'

export default function SomeComponent(){
  return <div className={styles.success}>
    This is a component that uses CSS modules
  </div>
}
```

### Configuration

The `next-config.js` file in the root.  This is where you add support for Less or config webpack stuff.  `next-config.js` can also export a function which accepts a phase.  Phases are strings that represent phases of the Next build and run process.  You can add special hooks based on phase, for example if you wanted to only do something for the production build:

```js
const { PHASE_PRODUCTION_SERVER } = require('next/constants')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    return {
      ...defaultConfig,
      webpack: {
        plugins: [new BundleAnalyzerPlugin()]
      }
    }
  }

  return defaultConfig
} 
```

You can also add environment variables.  Here's a rundown for how this works: https://nextjs.org/docs/basic-features/environment-variables

The main takeaways are that Next uses a dotenv-like system, where you can make `.env.production` and `.env.development`, which get used whether you run `next start` or `next dev` respectively.  The convention is for those files not to contain secrets and be committed to source control.  `.env.local` is the file where you keep all your secrets and is gitignored.

To share variables to the browser, they must be prefixed with `NEXT_PUBLIC_VARIABLENAME` which will allow them to be used in the frontend via `process.env.NEXT_PUBLIC_VARIABLENAME`

Environment variables are just strings, so using something like arrays or key value stores, you'll need to use yaml or something.

### API

Next.js comes with an API server.  These live in the `pages/api` directory, and routing is done exactly the same as pages as far as parameters and catch-alls.

The API route handlers uses connect, which is what express was built on, so you can write a handler like this at `pages/api/hello-world.js`:

```js
export default (req, res) => {
  res.json({
    hello: 'world'
  });
}
```

You can handle different HTTP methods using `next-connect` which does lots of middleware things that you expect.

```js
import connect from 'next-connect';

const handler = connect()
  .get(
    (req, res) => {
      res.json({ message: 'ok' })
    }
  )
  .post(
    (req, res) => {
      res.json({ message: 'posted' })
    }
  )

export default handler;
```

### Data fetching

When it comes to pre-rendering pages on the server side (either via static generation or on-request server side rendering), these are the three methods that are used to fetch data to prerender pages.

* `getStaticProps` - function that returns an object with the props that are used to render the page.  this function accepts a `context` argument, which contains the route params for the page.  But how can those be known if this is rendered on the server at build time?  Well a list of all possible paths to this page is generated by `getStaticPaths` below.
* `getStaticPaths` - function returns a list of all possible paths for a particular page.  For example, for the post detail page on a blog, it would fetch all possible blog ids and create a list of 
* `getServerSideProps` - function that returns props used to render a page __at request time__.  So this is not for static generation, this is for server side rendering.  It receives `params`, `req`, and `res` as arguments, so you can do can examine the request and manually handle the response if you need.  You could even do authentication here.  This runs with every request, so avoid expensive time-consuming code here.

You would not use these in client-side components, only in pages.

### Server side rendering
If you try to render something on the server that uses DOM APIs (eg. `window` or `document`), there will be errors.  A way to deal with this is dynamic imports.  This allows us to specify certain components to only render on the client in a page that will otherwise be rendered on the server.

```js
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/hello3'),
  { ssr: false }
)

function Home() {
  return (
    <div>
      <Header />
      <DynamicComponentWithNoSSR />
      <p>HOME PAGE is here!</p>
    </div>
  )
}

export default Home
```

