const express = require("express");
const proxy = require("express-http-proxy");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const KeyEncoder = require("key-encoder");
const crypto = require("crypto");
const path = require("path");

if (!process.env.PUBLIC_KEY) {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.generateKeys();

  console.log("PRIVATE_KEY ", ecdh.getPrivateKey("base64"));
  console.log("PUBLIC_KEY  ", querystring.escape(ecdh.getPublicKey("base64")));
  process.exit(1);
}

if (!process.env.validIAT) {
  console.log("validIAT=", Math.floor(new Date() / 1000));
}

const authPath = process.env.AUTH_PATH || "/~auth";
const service = process.env.SERVICE || "senomas";
const validIAT = parseInt(process.env.validIAT);
const key = process.env.PUBLIC_KEY;
const keyEncoder = new KeyEncoder("secp256k1");
const pem = keyEncoder.encodePublic(
  Buffer.from(querystring.unescape(key), "base64"),
  "raw",
  "pem"
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

router.post("/token", (req, res) => {
  const data = req.body;
  if (!data.user) {
    return res.status(500).send({ message: "Field 'user' is required" });
  }
  if (!data.key) {
    return res.status(500).send({ message: "Field 'key' is required" });
  }
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(Buffer.from(data.key, "base64"));
  const pkeyPem = keyEncoder.encodePrivate(ecdh.getPrivateKey(), "raw", "pem");
  const token = jwt.sign({ sub: data.user, kid: service }, pkeyPem, {
    algorithm: "ES256",
    expiresIn: data.expiry ? parseInt(data.expiry, 10) * 3600 : 86400
  });
  try {
    jwt.verify(token, pem);
  } catch (err) {
    return res.status(500).send({
      message: `Invalid 'key'`
    });
  }
  res.json({ user: data.user, token });
});

router.get("/token/:token", (req, res) => {
  res.json(jwt.decode(req.params.token, pem));
});

app.use(`${authPath}/api`, router);

app.use(authPath, express.static(path.join(__dirname, 'admin/dist')))
// app.use(
//   authPath,
//   proxy("http://localhost:8080", {
//     proxyReqPathResolver: req => {
//       return "/~auth/"+req.url;
//     }
//   })
// );

app.use(
  "/",
  proxy(process.env.TARGET, {
    filter: (req, res) => {
      try {
        const auth = req.headers.authorization;
        if (!auth && !auth.startsWith("Basic ")) {
          return false;
        }
        const [user, pass] = Buffer.from(auth.substring(6), "Base64")
          .toString()
          .split(":");
        const jd = jwt.verify(pass, pem);
        if (user !== jd.sub) {
          return false;
        }
        if (jd.iat < validIAT) {
          return false;
        }
        if (jd.kid !== service) {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
  })
);

app.use("/", (req, res, next) => {
  res
    .status(401)
    .set("WWW-Authenticate", `Basic realm="${service}"`)
    .send("Access denied");
});

const server = app.listen(8000, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
});
