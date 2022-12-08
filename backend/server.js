const express = require("express");
const crypto = require("node:crypto");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const { userInfo } = require("node:os");
const app = express();
const port = 5001;
const userId = `962e3475-2d34-4a6f-a301-8b9fb8b36ecc`;
const clientId = "egE7AmFhWu40nDx3vm7x9HQOgjuUxHhuU8WP8mjAviY";
const clientSecret =
  "lPi7i_NOLBbI9mVvvpoQWv8W_zFp0kAYp-LeG4Vb2OVt6RFtpvjH21lTurZMEjpZqaD4y6YuS_dKsY2UV8wl4Yu5nWFP9M9RfvyGL6F_QoYM1v1OlZxogpL3fOQEhr73qZx5Y4_goldnUbCxKZwxtQhCTx-mKZj766EoUrCXuM1Ck1S7u4CEy_kTBkiSXFhwpADVjQxzKNgfpZGdeXEDBlBsauZ6Fd13PrY02ez9KjS2_tZnCeTld9sM9PdPc-FJCSnQDQLrcEnWK3YAc4UVJjhHtBU4UbkfgqbTHGUtV8z5ypNyg-jEmZsvqbVe2VYjxJkD9_ZkI4V-VL1ZBiS3IQ";
const redirect_uri = "localhost:3001/redirect";
const jwtKey =
  "HUNTzrvQR-ZUqfLPE25ACSoVdT_G2sF_6XGKwscb5uskj8xGDIkeH9ff1PRuWBzMJl1PtewRUoSnWS39AUyT8LQ4BMUdsQpSIRPFrTaAUAlUUVTLR0G2u_Cz8Cg9dcHgDf36A3WqbL24pGPMitfwdtZnRtx-0UZdT5Ha6YcvAuTKHXKPVVzHLfkNrAyC3ktHe8SHuMLHvOyIpEUfzgaBF0ccmF7Qw3FfXjYbL8GcUPQscNBECg_dEcslH-WUMX0yI4J8wkAkYG-kefEaVpFpbN80GRQsTJGl8ZDFQ85lICSzgQgHxm8AfbQlyAbumxbTvIpZPK6WnPd5MGoxflQvaA";
let codeVerifier;
let accessToken;

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.get("/", (req, res) => {
  res.json(
    JSON.stringify({
      test: "test return",
    })
  );
});

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

app.post("/submitimage", async (req, res) => {
  // const parsed = await express.json(req);
  console.log(req.body);
  const url = `http://localhost:3000/comparefaces?id=${userId}&clientId=${clientId}$clientSecret=${clientSecret}`;
  try {
    const compareRes = await fetch({
      url,
      body: {
        image,
      },
    });
    console.log(compareRes);
  } catch (err) {
    console.log(err);
  }
  res.json(
    JSON.stringify({
      reuslt: "test result",
    })
  );
});

app.get("/codeResponse", async (req, res) => {
  console.log(req.query);
  const code = req.query.code;
  console.log(new Date().toISOString());
  const url = `https://dev.auth.authillo.com/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${codeVerifier}&client_id=${clientId}&client_secret=${clientSecret}&request_type=OIDC`;
  // const url = `http://localhost:3000/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${codeVerifier}&client_id=${clientId}&client_secret=${clientSecret}&request_type=OIDC`;

  const tokenRes = await fetch(url, {
    method: "POST",
  });
  console.log(new Date().toISOString());

  const parsed = await tokenRes.json();
  console.log(new Date().toISOString());

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

  // const parsed = JSON.parse(tokenRes);
  // console.log(parsed);
  // const token = parsed?.body;
  const userInfo = await userInfoReq(accessToken);
  console.log(new Date().toISOString());

  console.log("userInfo in codeResponse: ", userInfo);
  res.json(
    JSON.stringify({
      idToken: verifiedToken,
      userInfo,
    })
  );
});

const userInfoReq = async (token) => {
  const url = `https://dev.auth.authillo.com/userinfo`;
  // const url = `http://localhost:3000/userinfo`;

  const useRInfoRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const parsedRes = await useRInfoRes.json();
  console.log(parsedRes);
  console.log(parsedRes?.result?.feedback);
  return parsedRes?.result?.feedback;
};

app.listen(port, () => {
  console.log(`express server started listening on ${port}`);
});
