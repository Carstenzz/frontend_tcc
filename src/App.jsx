import LoginPage from "./features/LoginPage.jsx";
import RegisterPage from "./features/RegisterPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/HomePage.jsx";

export default function App() {
	return (
		<Router>
			<div>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/" element={<HomePage />} />
				</Routes>
			</div>
		</Router>
	);
}
