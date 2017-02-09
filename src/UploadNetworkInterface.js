import { printAST } from 'apollo-client'
import { HTTPFetchNetworkInterface, printRequest } from 'apollo-client/transport/networkInterface'

export default function createNetworkInterface(opts) {
  const { uri } = opts
  return new UploadNetworkInterface(uri, opts)
}

export class UploadNetworkInterface extends HTTPFetchNetworkInterface {

  fetchFromRemoteEndpoint(req) {
    const options = this.isUpload(req)
      ? this.getUploadOptions(req)
      : this.getJSONOptions(req)
    return fetch(this._uri, options);
  }
  
  isArrayOfFiles(list) {
    if (Array.isArray(list)) {
      let returnValue = false;
      for (var key in list) {
        if (list[key] instanceof File) {
          returnValue = true;
        } else {
          return false;
        }
      }
      return returnValue
    }
    return false;
  }

  isUpload({ request }) {
    if (request.variables) {
      for (let key in request.variables) {
        if (request.variables[key] instanceof FileList) {
          return true
        }
        if (request.variables[key] instanceof File) {
            return true;
          }
        if (this.isArrayOfFiles(request.variables[key])) {
          return true;
        }
      }
    }
    return false
  }

  getJSONOptions({ request, options }) {
    return Object.assign({}, this._opts, {
      body: JSON.stringify(printRequest(request)),
      method: 'POST',
    }, options, {
      headers: Object.assign({}, {
        Accept: '*/*',
        'Content-Type': 'application/json',
      }, options.headers),
    })
  }

  getUploadOptions({ request, options }) {
    const body = new FormData()
    const variables = {}

    for (let key in request.variables) {
      let v = request.variables[key]
      if (v instanceof FileList) {
        Array.from(v).forEach(f => body.append(key, f))
      } else if (isArrayOfFiles(v)) {
          for (var file in v) {
            return body.append(key, file); // this part seems buggy
          }
      } else {
        variables[key] = v
      }
    }

    body.append('operationName', request.operationName)
    body.append('query', printAST(request.query))
    body.append('variables', JSON.stringify(variables))

    return Object.assign({}, this._opts, {
      body,
      method: 'POST',
    }, options, {
      headers: Object.assign({}, {
        Accept: '*/*',
      }, options.headers),
    })
  }

}
