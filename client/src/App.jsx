import { Link } from "react-router";
import LogoutButton from "./components/ui/logout";

function App() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Finance Tracker</h1>
         {/* Logout button in the top-right corner */}
        <LogoutButton />
      </div>

      <div>
        <h1>Main Entry Point</h1>
        <Link to="/auth/login">Login</Link>
      </div>
    </div>
  );
}

export default App;
