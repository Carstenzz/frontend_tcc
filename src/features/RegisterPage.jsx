import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../controller/auth";

export default function RegisterPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const success = await register(username, password);
			if (!success) throw new Error("Registration failed");
			setSuccess("Registration successful! Redirecting to login...");
			setTimeout(() => navigate("/login"), 1200);
		} catch (err) {
			// Show backend error message if available
			if (
				err.response &&
				err.response.data &&
				err.response.data.message
			) {
				setError("Register failed: " + err.response.data.message);
			} else {
				setError("Register failed: " + err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
			<form
				onSubmit={handleRegister}
				className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6"
			>
				<h1 className="text-4xl mb-2 text-center font-extrabold">
					Register
				</h1>
				{error && (
					<div className="mb-2 text-red-400 text-center">{error}</div>
				)}
				{success && (
					<div className="mb-2 text-green-400 text-center">
						{success}
					</div>
				)}
				<input
					className="w-full p-3 rounded bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					disabled={loading}
				/>
				<input
					className="w-full p-3 rounded bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={loading}
				/>
				<button
					className="w-full bg-[var(--color-accent)] text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition disabled:opacity-60 disabled:cursor-not-allowed"
					type="submit"
					disabled={loading}
				>
					{loading ? (
						<span className="flex items-center justify-center gap-2">
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8z"
								></path>
							</svg>
							Loading...
						</span>
					) : (
						"Register"
					)}
				</button>
				<div className="mt-2 text-center">
					<span className="text-gray-300">
						Already have an account?{" "}
					</span>
					<span
						className="text-[var(--color-accent)] cursor-pointer hover:underline"
						onClick={() => !loading && navigate("/login")}
					>
						Login
					</span>
				</div>
			</form>
		</div>
	);
}
