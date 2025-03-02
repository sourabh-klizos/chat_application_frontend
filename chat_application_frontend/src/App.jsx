import LoginPage from "./pages/LoginPage"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "../src/styles/HomePage.css"; 

function App() {


  return (
    <>
  <div className="container">
      <h2 className="title">Welcome to Home Page</h2>
      <p className="links">
        <Link to="/login" className="btn">Go to Login</Link>
        <span> | </span>
        <Link to="/signup" className="btn">Go to Signup</Link>
      </p>
    </div>
    </>
  )
}

export default App
