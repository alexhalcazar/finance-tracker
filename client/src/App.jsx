import { Link } from "react-router";

function App() {
  return (
    <div>
      <h1>Main Entry Point</h1>
      <Link to="/auth/login">Login</Link>
    </div>
  );
}

export default App;
