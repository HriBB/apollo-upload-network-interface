import { assert } from 'chai'
import createNetworkInterface, { UploadNetworkInterface } from '../src'

describe('UploadNetworkInterface', function() {
  it('should create network interface without crashing', function() {
    const networkInterface = createNetworkInterface({
      uri: '/graphql'
    })
    assert.instanceOf(
      networkInterface,
      UploadNetworkInterface,
      'networkInterface is instance of UploadNetworkInterface');
  });
});
