import { useEffect } from "react";

export const Redirect = () => {
  useEffect(() => {
    console.log("redirect mounted");
    const queryParams = new URLSearchParams(window.location.search);
    fetch(
      "http://localhost:5001/codeResponse?" +
        new URLSearchParams({ code: queryParams.get("code") })
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response, "response from fetch");
      });
  }, []);
  return (
    <div>
      Redirect
      <button
        onClick={() => {
          window.location.search = "";
          window.location.pathname = "/";
        }}
      >
        Home
      </button>
    </div>
  );
};
