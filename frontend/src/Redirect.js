import { useEffect } from "react";

export const Redirect = () => {
  useEffect(() => {
    console.log("redirect mounted");
  }, []);
  return <div>Redirect</div>;
};
