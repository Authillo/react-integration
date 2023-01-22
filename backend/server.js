const express = require("express");
const crypto = require("node:crypto");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5001;
// const clientId = "egE7AmFhWu40nDx3vm7x9HQOgjuUxHhuU8WP8mjAviY";
// const clientSecret = `M_gO6yeMNkB8w9LPxhKqgE83mbRrIVM9V6uXw6GrOFsVFeaL2BELaoumsegVleZAEPheGwKO3TxIAWcCRleX4FyGml_vGgmObtZuoitc-0JOq6T5S15UF-ah7i5PSH7Bpkx8pclenF_vwl1Gxk9MsEpo05cnR3grFobACSQBDDe3LqpNXuzcZuLko91bYuiTUVs8j947kj0rJGbz5W20kk2xxYNmTRj-8bkRzHzGeli882u-20eU1TA8Lh1vg9hGadGznzw2vBW016CGgSRqXYZBG_NaL9dBoCv0zFmX-dqQ8rn7FShgAqEvTPjQ_AtFXpN2yT_Iujs3egoykJ91Tw`;
const clientId = "w3qi-IP24Vc6mFafN1ZCUuY5VhtjiU5aCu9hrC50Kg8";
const clientSecret =
  "BjxF6O866PvTa5JPW7ATVobPD4WgNqxh56b2Q9wLpp3sBbbMXJf0zt7rMGlgLnRFygAYlXTaxRwXEIE_iXKlh54pfgHOHB18xgahJRawOCNoBcGUXW0ajDTOn2td3DeZ4gZ_fd3oaMt3Hqzo3WblZTjwV4-LQZEYElW97qCinRZpjxCmc16ZiSCy98olDj_w3cMLWs-xe3IBqbVS9rGMD01zc0r1R9jsbtz0pmB43qnwwN8hxaxrXSbVnt7atmQ5Jt56Uqyts9xoZVOaA8AzhmrXBIWS33J2MCC381VcMAsdj5BYnXKR9cFxX--YueMPYZ77CxAzwkIHr3H0im2cww";
const redirect_uri = "localhost:3001/redirect";
// const jwtKey =
// "HUNTzrvQR-ZUqfLPE25ACSoVdT_G2sF_6XGKwscb5uskj8xGDIkeH9ff1PRuWBzMJl1PtewRUoSnWS39AUyT8LQ4BMUdsQpSIRPFrTaAUAlUUVTLR0G2u_Cz8Cg9dcHgDf36A3WqbL24pGPMitfwdtZnRtx-0UZdT5Ha6YcvAuTKHXKPVVzHLfkNrAyC3ktHe8SHuMLHvOyIpEUfzgaBF0ccmF7Qw3FfXjYbL8GcUPQscNBECg_dEcslH-WUMX0yI4J8wkAkYG-kefEaVpFpbN80GRQsTJGl8ZDFQ85lICSzgQgHxm8AfbQlyAbumxbTvIpZPK6WnPd5MGoxflQvaA";
const jwtKey =
  "9owmlhpNszhiTM8qRfhuYLe4YcuHsygBERpCNSze9qNk3-F7iyXbhflW8SBy-BVfmAXg69CoBh_j8XB6GCJzn6sHKcJdGzhXHnB7rCYYyJ36U_0ap2XxqK44O_Je1Gn1f2FWmHzeZJYLaFGs8E8UeDWTtIUFG5aNcR9CaP4K2Nqcj6HkbIfXpBFabmhZ17diMx63V8-tJmj4lN4Q47V8xl27KLfNzK8IU4zfaW_JEhJUn9SguWKPzIlHB97nzNIuSnR7i4P-3wglQncv0RonWxf9NCqdmK8-mC7AK0RkwuRIqM5IhvJBJk2HPTApXuigd7Yqjwj61uaZoH2dmyyCMg";
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

app.get("/codeResponse", async (req, res) => {
  console.log(req.query);
  const code = req.query.code;
  console.log(new Date().toISOString());
  // const url = `https://dev.auth.authillo.com/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${codeVerifier}&client_id=${clientId}&client_secret=${clientSecret}&request_type=OIDC`;
  const url = `http://localhost:3000/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${codeVerifier}&client_id=${clientId}&client_secret=${clientSecret}&request_type=OIDC`;

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
  const userInfo = await userInfoReq(accessToken);
  console.log(new Date().toISOString());

  console.log("userInfo in codeResponse: ", userInfo);
  res.json(
    JSON.stringify({
      idTokenParsed: verifiedToken,
      idToken,
      userInfo,
    })
  );
});

const userInfoReq = async (token) => {
  // const url = `https://dev.auth.authillo.com/userinfo`;
  const url = `http://localhost:3000/userinfo`;

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
