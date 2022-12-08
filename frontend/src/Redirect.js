import { useEffect, useState } from "react";

export const Redirect = () => {
  const [name, setName] = useState("");
  const [userInfo, setUserInfo] = useState(null);
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
        console.log("userInfo:", response?.userInfo);
        try {
          const parse = JSON.parse(response);
          console.log(parse?.userInfo);
          setName(parse?.userInfo?.userAttributes?.nickname);
          setUserInfo(parse?.userInfo);
        } catch (err) {
          console.log("error: ", err);
        }
      });
  }, []);
  return (
    <div>
      <button
        onClick={() => {
          window.location.search = "";
          window.location.pathname = "/";
        }}
      >
        Home
      </button>
      <div>{name !== "" && name !== undefined && `Hello ${name}`}</div>
      <div>
        {JSON.stringify(userInfo).includes("riskScore") && (
          <h4>Face Verified = true</h4>
        )}
      </div>
      {userInfo != null && <div>Response: {JSON.stringify(userInfo)}</div>}
    </div>
  );
};
