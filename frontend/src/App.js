import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { Redirect } from "./Redirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "redirect",
    element: <Redirect />,
    // element: <>hello</>,
  },
]);

function App() {
  return (
    <div className="App">
      <h1>Welcome to Authillo React integration example</h1>
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
                const scopes = `openid name`;
                const clientId = "egE7AmFhWu40nDx3vm7x9HQOgjuUxHhuU8WP8mjAviY";
                const maxAge = 3600;
                const codeChallenge = parsedResponse.codeChallenge;
                console.log(codeChallenge);
                const redirectLink = `http://localhost:4200/authorize?response_type=code&scope=${scopes}&state=undefined&redirect_uri=localhost:3001/redirect&client_id=${clientId}&max_age=${maxAge}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
                window.location.href = redirectLink;
              });
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default router;
