# apollo-upload-network-interface

UploadNetworkInterface for Apollo GraphQL Client. Adds support for `multipart/form-data` requests.

Used together with [graphql-server-express-upload](https://github.com/HriBB/graphql-server-express-upload) and [graphql-server-koa-upload](https://github.com/HriBB/graphql-server-koa-upload) (coming soon).

_Any help is appreciated!_

## Usage

```
import ApolloClient from 'apollo-client'
import createNetworkInterface from 'apollo-upload-network-interface'

const networkInterface = createNetworkInterface({
  uri: '/graphql',
})

const client = new ApolloClient({
  networkInterface
})
```
If you get an error like this
```
/node_modules/apollo-client/transport/networkInterface.js:9
import 'whatwg-fetch';
^^^^^^

SyntaxError: Unexpected token import
```
You need to configure you `babel-loader` like this
```
{
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules\/(?!(apollo-client)\/).*/,
  include: [
    path.resolve(__dirname, '..', 'config'),
    path.resolve(__dirname, '..', 'client'),
    path.resolve(__dirname, '..', 'node_modules', 'apollo-client'),
    //reactMdlExtraPath,
  ],
  query: {
    cacheDirectory: true,
  },
}
```

## TODO

- [ ] Add tests
- [ ] Convert to typescript
