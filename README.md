# apollo-upload-network-interface
UploadNetworkInterface for Apollo GraphQL Client

## Usage

```
import ApolloClient from 'apollo-client'
import createNetworkInterface from 'apollo-upload-network-interface'

const networkInterface = createNetworkInterface({
  uri: config.graphql.url,
})

export default new ApolloClient({
  networkInterface
})
```

## TODO

- [ ] Add some tests
