const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("node:crypto");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = 5001;

// Set the client ID and client secret for your app here
const clientId = process.env.CLIENT_ID_PROD;
const clientSecret = process.env.CLIENT_SECRET_PROD;
const jwtKey = process.env.JWT_KEY_PROD;
const redirect_uri = "localhost:3001/redirect";
let codeVerifier;
let accessToken;

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json());

// Get the code challenge and save it on the server
app.get("/getCodeChallenge", (req, res) => {
  codeVerifier = crypto.randomBytes(32).toString("base64url");
  codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  res.json(
    JSON.stringify({
      codeChallenge,
    })
  );
});

// Get the code from the redirect and make the token & userinfo requests
app.get("/codeResponse", async (req, res) => {
  console.log(req.query);
  const code = req.query.code;
  const url = `https://auth.authillo.com/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${codeVerifier}&client_id=${clientId}&client_secret=${clientSecret}&request_type=OIDC`;

  const tokenRes = await fetch(url, {
    method: "POST",
  });
  const parsed = await tokenRes.json();
  console.log(parsed);
  accessToken = parsed?.result?.feedback?.access_token;
  const idToken = parsed?.result?.feedback?.id_token;
  console.log(idToken);
  let verifiedToken;

  try {
    verifiedToken = jwt.verify(idToken, jwtKey);
    console.log("token is valid: ", verifiedToken);
  } catch (err) {
    console.log("invalid token");
    console.log(err);
  }
  let userInfo;
  if (req.query.makeUserInfoReq === "true") {
    userInfo = await userInfoReq(accessToken);
    console.log(new Date().toISOString());
    console.log("userInfo in codeResponse: ", userInfo);
  }

  res.json(
    JSON.stringify({
      idTokenParsed: verifiedToken,
      idToken,
      userInfo: userInfo ?? null,
    })
  );
});

const userInfoReq = async (token) => {
  const url = `https://auth.authillo.com/userinfo`;

  const userInfoRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const parsedRes = await userInfoRes.json();
  console.log(parsedRes);
  console.log(parsedRes?.result?.feedback);
  return parsedRes?.result?.feedback;
};

app.listen(port, () => {
  console.log(`express server started listening on ${port}`);
});
