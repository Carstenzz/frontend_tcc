import React, { useState, useEffect } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const [notes, setNotes] = useState([]);
	const [error, setError] = useState("");

	const [creatingNote, setCreatingNote] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [updatingNote, setUpdatingNote] = useState(false);
	const [updateID, setUpdateID] = useState(0);

	const [viewing, setViewing] = useState(false);
	const [viewID, setViewID] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}
		fetchNote();
	}, []);

	// const fetchNote = async () => {
	// 	const response = await fetch("http://localhost:4200/notes");
	// 	const data = await response.json();
	// 	setNotes(data);
	// 	console.log(data);
	// };

	const fetchNote = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get(`${BASE_URL}/notes`, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${token}` },
			});
			// The original fetch system expected an array of notes
			// and setNotes(data) where data is the array
			// Here, adapt to match that:
			const data = response.data;
			// If your backend returns { notes: [...] }, use data.notes
			setNotes(data.notes || []);
			setError("");
		} catch (err) {
			// Redirect to /login if error is any 4xx
			if (err?.response?.status >= 400 && err?.response?.status < 500) {
				navigate("/login");
			} else if (err?.response?.data?.message) {
				setError("Failed to load notes: " + err.response.data.message);
			} else if (err?.message) {
				setError("Failed to load notes: " + err.message);
			} else {
				setError("Failed to load notes. Please try again.");
			}
		}
	};

	// const createNote = async () => {
	// 	const response = await fetch("http://localhost:4200/add-note", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			title: title,
	// 			content: content,
	// 		}),
	// 	});
	// 	const data = await response.json();
	// 	console.log(data);
	// 	fetchNote();
	// };

	const createNote = async () => {
		// Ambil token terbaru dari localStorage
		const currentToken = localStorage.getItem("token");
		let decodedId = "";
		if (currentToken) {
			try {
				const decoded = jwtDecode(currentToken);
				decodedId = decoded.id;
			} catch (e) {
				setError("Token invalid. Please login again.");
				return;
			}
		}
		if (!decodedId) {
			setError("User ID not found. Please try again.");
			return;
		}
		const data = {
			title: title,
			content: content,
			userId: decodedId,
		};
		try {
			await axiosInstance.post(`${BASE_URL}/add-note`, data, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${currentToken}` },
			});
			navigate("/");
		} catch (error) {
			// Redirect to /login if error is any 4xx
			if (
				error?.response?.status >= 400 &&
				error?.response?.status < 500
			) {
				navigate("/login");
			} else {
				setError(
					"Failed to create note: " +
						(error?.response?.data?.message || error.message)
				);
			}
		}
	};

	// const updateNote = async (id) => {
	// 	const response = await fetch("http://localhost:4200/edit-note/" + id, {
	// 		method: "PUT",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({
	// 			title: title,
	// 			content: content,
	// 		}),
	// 	});
	// 	fetchNote();
	// 	setUpdatingNote(false);
	// };

	const updateNote = async () => {
		const data = {
			id: id,
			title: title,
			content: content,
		};
		try {
			//   document.getElementById(id).innerText = title;
			const response = await axiosInstance.patch(
				`${BASE_URL}/note/${id}`,
				data,
				{
					withCredentials: true,
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		} catch (error) {
			alert(
				"Failed to update note: " +
					(error?.response?.data?.message || error.message)
			);
		}
	};

	// const deleteNote = async (id) => {
	// 	await fetch("http://localhost:4200/delete-note/" + id, {
	// 		method: "DELETE",
	// 	});
	// 	fetchNote();
	// };

	const deleteNote = async () => {
		try {
			await axiosInstance.delete(`${BASE_URL}/note/${id}`, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${token}` },
			});
			navigate("/");
		} catch (error) {
			alert(
				"Failed to delete note: " +
					(error?.response?.data?.message || error.message)
			);
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
			<div className="bg-gray-800 flex flex-col align-center p-3">
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
			</div>
			<div className="grow">
				{creatingNote && (
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
				{viewing && (
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
				{updatingNote && (
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
				{!viewing && !creatingNote && !updatingNote && (
					<div className="grid place-items-center h-screen">
						<div className="text-center">
							<p className="text-5xl pb-3 font-extrabold">
								Nothing here yet
							</p>
							<p>
								You can view, update, or create new notes by the
								bar on the left
							</p>
							<p>
								Ps: This notes partially support markdown, try
								to use * or #
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
