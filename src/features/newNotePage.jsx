import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// import { createNote } from "../controller/fetch_backend.js";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { getAxiosInstance } from "../controller/axiosInstance";

function NotePage() {
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [expire, setExpire] = useState("");
  let [token, setToken] = useState("");
  let [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const axiosInstance = getAxiosInstance({
    expire,
    setExpire,
    setToken,
    navigate,
    BASE_URL,
  });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, [token]);

  const createNoteOnPage = async () => {
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
      await axiosInstance.post(`${BASE_URL}/note`, data, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      navigate("/");
    } catch (error) {
      // Redirect to /login if error is any 4xx
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        navigate("/login");
      } else {
        setError(
          "Failed to create note: " +
            (error?.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <>
      <div className="flex w-full h-screen">
        <Sidebar />
        <div className="bg-[var(--color-primary)] w-full min-w-52 flex flex-col items-center h-full pt-10 pb-20 px-20">
          {error && <div className="mb-4 text-red-400">{error}</div>}
          <input
            type="text"
            value={title}
            placeholder="Input your title here."
            onChange={(e) => setTitle(e.target.value)}
            className="text-[var(--color-text)] text-4xl mb-15 text-center border-1 rounded-2xl outline-none p-2"
            maxLength={20}
          />

          <div className="md-container w-full h-full resize-none bg-[var(--color-tertiary)] rounded-2xl p-10 text-[var(--color-text)] outline-none overflow-y-auto">
            <textarea
              name="note"
              value={content}
              placeholder="Input your note here."
              onChange={(e) => setContent(e.target.value)}
              id="note"
              className="w-full h-[98%] resize-none bg-[var(--color-tertiary)] text-[var(--color-text)] outline-none"
            ></textarea>
          </div>
          <button
            className="bg-[var(--color-accent)] rounded-xl p-2 mt-8 w-30"
            onClick={() => createNoteOnPage()}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default NotePage;
