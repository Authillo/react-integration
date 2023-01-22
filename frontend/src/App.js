import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { Redirect } from "./Redirect";
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
  const clientId = "";
  useEffect(() => {
    console.log("adding listener");
    window.addEventListener("message", (event) => {
      console.log("message data: ", event.data);
      console.log("message: ", event);
      if (event.origin !== "http://localhost:4200") {
        console.log("invalid origin");
        return;
      }
      const code = event.data;
      fetch(
        "http://localhost:5001/codeResponse?" + new URLSearchParams({ code })
      )
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          console.log(response, "response from fetch");
          console.log("userInfo:", response?.userInfo);
          try {
            const parse = JSON.parse(response);
            console.log(parse);
            console.log(parse?.userInfo);
            console.log(parse?.idToken);
            // setName(parse?.userInfo?.userAttributes?.nickname);
            // setUserInfo(parse?.userInfo);
            setUserId(parse?.userInfo?.userAttributes?.sub);
            setJwt(parse?.idToken);
            setParsedJWT(parse?.idTokenParsed);
          } catch (err) {
            console.log("error: ", err);
          }
        });
    });
  }, []);
  useEffect(() => {
    console.log("app mounted");
    fetch("http://localhost:5001/getCodeChallenge")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        const parsedResponse = JSON.parse(response);
        console.log(parsedResponse, "response from fetch");
        setCodeChallenge(parsedResponse?.codeChallenge);
      });
  }, []);
  return (
    <div className="App">
      <h1>Welcome to Authillo React integration example</h1>
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
                const scopes = `openid`;
                const clientId = "egE7AmFhWu40nDx3vm7x9HQOgjuUxHhuU8WP8mjAviY";
                const maxAge = 3600;
                const codeChallenge = parsedResponse.codeChallenge;
                console.log(codeChallenge);
                const redirectLink = `https://dev.authillo.com/authorize?response_type=code&scope=${scopes}&state=undefined&redirect_uri=localhost:3001/redirect&client_id=${clientId}&max_age=${maxAge}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
                window.location.href = redirectLink;
              });
          }}
        >
          Login
        </button>
      </div>
      <div>
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
      </div>
      <div style={{ margin: "3rem" }}>
        <iframe
          src={`http://localhost:4200/iframe/popup?platform_name=Test%20Name&response_type=code&scope=openid&state=undefined&redirect_uri=localhost:3001/redirect&client_id=TestIntegration&max_age=3600&code_challenge=notreal&code_challenge_method=S256`}
          height="200"
          width="350"
          style={{ border: "none", borderRadius: ".5rem" }}
        >
          Oops
        </iframe>
      </div> */}
      <div style={{ margin: "3rem" }}>
        {codeChallenge != "" && (
          <iframe
            src={`http://localhost:4200/iframe/embedsignin?platform_name=Test%20Name&response_type=code&scope=openid&state=undefined&redirect_uri=localhost:3001/redirect&client_id=w3qi-IP24Vc6mFafN1ZCUuY5VhtjiU5aCu9hrC50Kg8&max_age=3600&code_challenge=${codeChallenge}&code_challenge_method=S256`}
            height="50"
            width="350"
            style={{ border: "none", borderRadius: "25px" }}
          >
            Oops
          </iframe>
        )}
      </div>
      {userId !== "" && userId !== undefined && <h2>Hello {userId}</h2>}
      {<p>JWT: {JSON.stringify(jwt)}</p>}
    </div>
  );
}

export default router;
