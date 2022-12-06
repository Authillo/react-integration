const express = require("express");
const app = express();
const port = 5001;
app.get("/", (req, res) => {
	res.json("hello world");
});
app.listen(port, () => {
	console.log(`express server started listening on ${port}`);
});
