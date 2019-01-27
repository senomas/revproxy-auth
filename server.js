const http = require("http");
const url = require("url");
const querystring = require("querystring");
const httpProxy = require("http-proxy");
const auth = require("basic-auth");
const jwt = require("jsonwebtoken");
const KeyEncoder = require("key-encoder");
const crypto = require("crypto");

const proxy = httpProxy.createProxyServer();

if (!process.env.PUBLIC_KEY) {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.generateKeys();

  console.log("PRIVATE_KEY ", querystring.escape(ecdh.getPrivateKey("base64")));
  console.log("PUBLIC_KEY  ", querystring.escape(ecdh.getPublicKey("base64")));
  process.exit(1);
}

const key = process.env.PUBLIC_KEY;
const keyEncoder = new KeyEncoder("secp256k1");
const pem = keyEncoder.encodePublic(Buffer.from(querystring.unescape(key), "base64"), "raw", "pem");

function check(name, pass) {
  try {
    const jd = jwt.verify(pass, pem);
    return name === jd.sub;
  } catch (err) {
    return false;
  }
}

http
  .createServer(function(req, res) {
    const upath = url.parse(req.url);
    const path = upath.pathname;
    if (path === "/auth") {
      const query = Object.assign({}, querystring.parse(upath.query));
      if (!!query.user && !!query.key) {
        try {
          const pkeyPem = keyEncoder.encodePrivate(
            Buffer.from(query.key, "base64"),
            "raw",
            "pem"
          );
          const token = jwt.sign({ sub: query.user }, pkeyPem, {
            algorithm: "ES256",
            expiresIn: query.expiry ? parseInt(query.expiry, 10) * 3600 : 86400
          });
          jwt.verify(token, pem);
          res.end(token);
        } catch (err) {
          res.statusCode = 500;
          res.end(err.message);
        }
        return;
      }
      res.statusCode = 500;
      res.end("Invalid request");
      return;
    }
    var credentials = auth(req);
    if (!credentials || !check(credentials.name, credentials.pass)) {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", 'Basic realm="example"');
      res.end("Access denied");
      return;
    }
    proxy.web(req, res, {
      target: process.env.TARGET
    });
  })
  .listen(8000);
