import { printAST, HTTPFetchNetworkInterface } from 'apollo-client';
import RecursiveIterator from 'recursive-iterator';
import objectPath from 'object-path';
import uuid from 'uuid';

export default function createNetworkInterface(opts) {
  const { uri } = opts;
  return new UploadNetworkInterface(uri, opts);
}

export class UploadNetworkInterface extends HTTPFetchNetworkInterface {
  constructor(...args) {
    super(...args);

    /**
     * Save the original fetchFromRemoteEndpoint method
     */
    const originalFetchFromRemoteEndpoint = this.fetchFromRemoteEndpoint.bind(this);

    /**
     * Patch the fetchFromRemoteEndpoint method
     */
    this.fetchFromRemoteEndpoint = ({request, options}) => {
      const formData = new FormData();

      /**
       * Recursively search for File objects in
       * he request and set it as formData
       */
      let hasFile = false;
      for (let { node, path } of new RecursiveIterator(request.variables)) {
        if (node instanceof File) {
          hasFile = true;

          const id = uuid.v4();
          formData.append(id, node);
          objectPath.set(request.variables, path.join('.'), id);
        }
      }

      if (hasFile) {

        /**
         * One or more Files are found, use the special fetcher
         */
        return this.uploadFetchFromRemoteEndpoint({request, options}, formData);
      } else {

        /**
         * No File is found, use the normal way
         */
        return originalFetchFromRemoteEndpoint({request, options});
      }
    };
  }

  /**
   * Alternative to `uploadFetchFromRemoteEndpoint`
   * to support FormData
   *
   * @param {Object} requestParams
   * @param {Object} requestParams.request The request
   * @param {Object} requestParams.options The request-options
   * @param {FormData} formData Containing the file(s)
   */
  uploadFetchFromRemoteEndpoint({request, options}, formData) {
    formData.append('operationName', request.operationName);
    formData.append('query', printAST(request.query));
    formData.append('variables', JSON.stringify(request.variables || {}));

    return fetch(this._opts.uri, {
      ...options,
      body: formData,
      method: 'POST',
      headers: {
        Accept: '*/*',
        ...options.headers,
      },
    });
  }

};
