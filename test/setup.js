require('babel-register')({
  ignore: /node_modules\/(?!apollo\-client)/i
});

require('./test.js')
