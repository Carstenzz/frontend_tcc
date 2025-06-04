import { useState, useEffect } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { getAxiosInstance } from "../controller/axiosInstance";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const HomePage = () => {
	const navigate = useNavigate();
	const [notes, setNotes] = useState([]);
	const [error, setError] = useState("");

	const [creatingNote, setCreatingNote] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [updatingNote, setUpdatingNote] = useState(false);
	const [updateID, setUpdateID] = useState(0);

	const [viewing, setViewing] = useState(false);
	const [viewID, setViewID] = useState(0);

	const [expire, setExpire] = useState("");
	const [token, setToken] = useState(localStorage.getItem("token") || "");

	const [loading, setLoading] = useState(false);

	const axiosInstance = getAxiosInstance({
		expire,
		setExpire,
		setToken,
		navigate,
		BASE_URL,
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}
		fetchNote();
	}, []);

	const fetchNote = async () => {
		setLoading(true);
		try {
			console.log("test");
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get(`${BASE_URL}/notes`, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${token}` },
			});

			const data = response.data;

			setNotes(data.notes || []);
			setError("");
			console.log("testw");
			console.log(data);
		} catch (err) {
			console.log("err");

			if (err?.response?.status >= 400 && err?.response?.status < 500) {
				navigate("/login");
			} else if (err?.response?.data?.message) {
				setError("Failed to load notes: " + err.response.data.message);
			} else if (err?.message) {
				setError("Failed to load notes: " + err.message);
			} else {
				setError("Failed to load notes. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const createNote = async () => {
		setLoading(true);
		const currentToken = localStorage.getItem("token");
		let decodedId = "";
		if (currentToken) {
			try {
				const decoded = jwtDecode(currentToken);
				decodedId = decoded.id;
			} catch (e) {
				localStorage.removeItem("token");
				setError("Token invalid. Please login again.");
				setLoading(false);
				return;
			}
		}
		if (!decodedId) {
			setError("User ID not found. Please try again.");
			setLoading(false);
			return;
		}
		const data = {
			title: title,
			content: content,
			userId: decodedId,
		};
		try {
			await axiosInstance.post(`${BASE_URL}/note`, data, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${currentToken}` },
			});
			await fetchNote();
		} catch (error) {
			if (
				error?.response?.status >= 400 &&
				error?.response?.status < 500
			) {
				localStorage.removeItem("token");
				navigate("/login");
			} else {
				setError(
					"Failed to create note: " +
						(error?.response?.data?.message || error.message)
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const updateNote = async (id) => {
		setLoading(true);
		const data = {
			id: id,
			title: title,
			content: content,
		};
		try {
			const response = await axiosInstance.patch(
				`${BASE_URL}/note/${id}`,
				data,
				{
					withCredentials: true,
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await fetchNote();
			setUpdatingNote(false);
			return response.data;
		} catch (error) {
			alert(
				"Failed to update note: " +
					(error?.response?.data?.message || error.message)
			);
		} finally {
			setLoading(false);
		}
	};

	const deleteNote = async (id) => {
		setLoading(true);
		try {
			await axiosInstance.delete(`${BASE_URL}/note/${id}`, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${token}` },
			});
			await fetchNote();
		} catch (error) {
			alert(
				"Failed to delete note: " +
					(error?.response?.data?.message || error.message)
			);
		} finally {
			setLoading(false);
		}
	};

	const createNew = () => {
		setTitle("");
		setContent("");
		setViewing(false);
		setCreatingNote(true);
		setUpdatingNote(false);
	};

	return (
		<div className="bg-gray-900 text-white min-h-screen flex">
			<div
				className="bg-gray-800 flex flex-col align-center p-3 relative min-h-screen"
				style={{ minWidth: "220px" }}
			>
				<p
					className="p-4 mb-3 text-3xl cursor-pointer"
					onClick={() => {
						setViewing(false);
						setCreatingNote(false);
						setUpdatingNote(false);
					}}
				>
					Your Notes
				</p>
				{notes.map((note) => {
					return (
						<button className="my-1 flex gap-3  hover:bg-gray-700 py-2 px-4 rounded-md min-w-52">
							<h3
								className="text-xl self-stretch cursor-pointer grow text-left"
								onClick={() => {
									setViewID(note.id);
									setViewing(true);
									setCreatingNote(false);
									setUpdatingNote(false);
								}}
							>
								{note.title}
							</h3>
							<div className="flex gap-3">
								<button
									className="cursor-pointer"
									onClick={() => {
										setUpdateID(note.id);
										setUpdatingNote(true);
										setViewing(false);
										setCreatingNote(false);
										setTitle(note.title);
										setContent(note.content);
									}}
								>
									<FaPencilAlt />
								</button>
								<button
									onClick={() => {
										deleteNote(note.id);
									}}
									className="cursor-pointer"
								>
									<FaTrash />
								</button>
							</div>
						</button>
					);
				})}
				<button
					className="mt-3 text-2xl hover:bg-gray-700 p-2 px-4 rounded-md self-center cursor-pointer"
					onClick={() => {
						createNew();
					}}
				>
					+
				</button>

				<button
					className="absolute left-0 bottom-0 m-4 w-[calc(100%-32px)] bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md font-semibold shadow-lg"
					onClick={() => {
						localStorage.removeItem("token");
						navigate("/login");
					}}
				>
					Logout
				</button>
			</div>
			<div className="grow">
				{loading && (
					<div className="flex flex-col items-center justify-center h-screen">
						<div className="relative flex items-center justify-center mb-6">
							<div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[var(--color-accent)] border-opacity-60"></div>
							<span className="absolute text-3xl font-bold text-[var(--color-accent)]">
								⏳
							</span>
						</div>
						<p className="text-2xl font-semibold text-[var(--color-accent)] mb-2">
							Loading...
						</p>
						<p className="text-base text-[var(--color-text)] opacity-70">
							Please wait while we fetch your notes.
						</p>
					</div>
				)}
				{!loading && creatingNote && !error && (
					<div className="flex flex-col gap-5 h-screen p-20">
						<p className="text-5xl pb-3 text-center font-extrabold">
							Create New Note
						</p>
						<input
							className="bg-gray-800 p-5 text-2xl"
							placeholder="title"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						></input>
						<textarea
							className="bg-gray-800 grow p-5"
							placeholder="content (markdown)"
							value={content}
							onChange={(e) => {
								setContent(e.target.value);
							}}
						></textarea>
						<button
							className="mt-3 text-xl bg-gray-800 hover:bg-gray-700 p-2 px-4 rounded-md self-center cursor-pointer"
							onClick={() => {
								createNote();
							}}
						>
							Add note
						</button>
					</div>
				)}
				{!loading && viewing && !error && (
					<div className="p-20 flex flex-col h-full">
						{notes.map((note) => {
							if (note.id == viewID) {
								return (
									<>
										<h1 className="text-5xl text-center font-extrabold mb-10">
											{note.title}
										</h1>
										<div className="bg-gray-800 p-5 rounded-md grow">
											<ReactMarkdown
												components={{
													h1: ({ children }) => (
														<h1 className="text-3xl font-bold">
															{children}
														</h1>
													),
													h2: ({ children }) => (
														<h2 className="text-2xl font-semibold">
															{children}
														</h2>
													),
													h3: ({ children }) => (
														<h3 className="text-xl font-medium">
															{children}
														</h3>
													),
												}}
											>
												{note.content.replace(
													/\n/g,
													"  \n"
												)}
											</ReactMarkdown>
										</div>
									</>
								);
							}
						})}
					</div>
				)}
				{!loading && updatingNote && !error && (
					<div className="flex flex-col gap-5 h-screen p-20">
						<p className="text-5xl pb-3 text-center font-extrabold">
							Updating Note
						</p>
						<input
							className="bg-gray-800 p-5 text-2xl"
							placeholder="title"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						></input>
						<textarea
							className="bg-gray-800 grow p-5"
							placeholder="content (markdown)"
							value={content}
							onChange={(e) => {
								setContent(e.target.value);
							}}
						></textarea>
						<button
							className="mt-3 text-xl bg-gray-800 hover:bg-gray-700 p-2 px-4 rounded-md self-center cursor-pointer"
							onClick={() => {
								updateNote(updateID);
							}}
						>
							Update Note
						</button>
					</div>
				)}
				{!loading &&
					!viewing &&
					!creatingNote &&
					!updatingNote &&
					!error && (
						<div className="grid place-items-center h-screen">
							<div className="text-center">
								<p className="text-5xl pb-3 font-extrabold">
									Nothing here yet
								</p>
								<p>
									You can view, update, or create new notes by
									the bar on the left
								</p>
								<p>
									Ps: This notes partially support markdown,
									try to use * or #
								</p>
							</div>
						</div>
					)}
				{!loading && error && (
					<div className="grid place-items-center h-screen">
						<div className="text-center">
							<p className="text-5xl pb-3 font-extrabold text-red-400">
								Error
							</p>
							<p className="mb-4 text-red-300">{error}</p>
							<p>
								Please try again or contact support if the
								problem persists.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
