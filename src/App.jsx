import React from "react";
import NotePage from "./features/NotePage.jsx";
import MainPage from "./features/MainPage.jsx";
import NewNotePage from "./features/newNotePage.jsx";
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
					{/* <Route path="/:id" element={<NotePage />} />
          <Route path="/new-note" element={<NewNotePage />} /> */}
				</Routes>
			</div>
		</Router>
	);
}
