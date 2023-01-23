import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { Redirect } from "./Redirect";
import { IframeSignIn } from "./IframeSignIn";
import { useEffect, useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "redirect",
    element: <Redirect />,
  },
]);

function App() {
  const [codeChallenge, setCodeChallenge] = useState("");
  const [userId, setUserId] = useState("");
  const [jwt, setJwt] = useState("");
  const [parsedJWT, setParsedJWT] = useState("");
  const clientId = "w3qi-IP24Vc6mFafN1ZCUuY5VhtjiU5aCu9hrC50Kg8";
  const redirectUrl = "localhost:3001/redirect";
  useEffect(() => {
    fetch("http://localhost:5001/getCodeChallenge")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        const parsedResponse = JSON.parse(response);
        setCodeChallenge(parsedResponse?.codeChallenge);
      });
  }, []);

  return (
    <div className="App">
      <h1>Welcome to Authillo React integration example</h1>

      {codeChallenge !== "" && jwt === "" && (
        <IframeSignIn
          expectedOrigin="http://localhost:4200"
          platformName="Test%20Name"
          codeChallenge={codeChallenge}
          clientId={clientId}
          redirectUrl={redirectUrl}
          callback={(code) => {
            fetch(
              "http://localhost:5001/codeResponse?" +
                new URLSearchParams({ code, makeUserInfoReq: true })
            )
              .then((res) => {
                return res.json();
              })
              .then((response) => {
                try {
                  const parse = JSON.parse(response);
                  setUserId(
                    parse?.userInfo?.userAttributes?.sub ??
                      parse?.idTokenParsed?.sub
                  );
                  setJwt(parse?.idToken);
                  setParsedJWT(parse?.idTokenParsed);
                } catch (err) {
                  console.log("error: ", err);
                }
              });
          }}
        />
      )}
      <div
        style={{ textAlign: "left", wordBreak: "break-word", padding: "2rem" }}
      >
        {userId !== "" && userId !== undefined && <h2>Hello {userId}</h2>}
        {jwt !== "" && <p>JWT: {JSON.stringify(jwt)}</p>}
        {parsedJWT !== "" && (
          <pre>JWT Parsed: {JSON.stringify(parsedJWT, null, 2)}</pre>
        )}
      </div>
      {/* <div>
        <button
          onClick={() => {
            fetch("http://localhost:5001/getCodeChallenge")
              .then((res) => {
                return res.json();
              })
              .then((response) => {
                const parsedResponse = JSON.parse(response);
                console.log(parsedResponse, "response from fetch");
                const scopes = `openid face`;
                const clientId = "egE7AmFhWu40nDx3vm7x9HQOgjuUxHhuU8WP8mjAviY";
                const maxAge = 3600;
                const codeChallenge = parsedResponse.codeChallenge;
                console.log(codeChallenge);
                const redirectLink = `https://dev.authillo.com/authorize?response_type=code&scope=${scopes}&state=undefined&redirect_uri=localhost:3001/redirect&client_id=${clientId}&max_age=${maxAge}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
                window.location.href = redirectLink;
              });
          }}
        >
          Login (face required)
        </button>
      </div> */}
    </div>
  );
}

export default router;
