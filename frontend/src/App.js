import "./App.css";

function App() {
	return (
		<div className="App">
			<h1>Welcome to Authillo React integration example</h1>
			<button
				onClick={() => {
					fetch("/").then((response) => {
						console.log(response, "response from fetch");
					});
				}}
			>
				fetch
			</button>
		</div>
	);
}

export default App;
