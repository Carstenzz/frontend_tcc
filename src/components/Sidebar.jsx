import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { getNotes } from "../controller/fetch_backend";
import History from "./History";
import { getAxiosInstance } from "../controller/axiosInstance";

function Sidebar() {
  const [historyRows, setHistoryRows] = useState([]);
  let [expire, setExpire] = useState("");
  let [token, setToken] = useState("");
  let [currentID, setCurrentID] = useState("");
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");
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
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}/notes`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const rows = data.notes.map((note, index) => (
          <History
            currentID={currentID}
            id={note.id}
            title={note.title}
            content={note.content}
            key={note.id}
          />
        ));
        setHistoryRows(rows);
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
    fetchData();
  }, [currentID]);

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await axiosInstance.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      if (error?.response?.data?.message) {
        setLogoutError("Logout failed: " + error.response.data.message);
      } else if (error?.message) {
        setLogoutError("Logout failed: " + error.message);
      } else {
        setLogoutError("Logout failed. Please try again.");
      }
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <div className="bg-[var(--color-secondary)] min-w-64 flex flex-col h-full">
        <div className="cotainer mt-10 mx-5">
          <h1 className="text-[var(--color-text)] text-3xl">SeviNotes</h1>
          <button
            className="bg-[var(--color-accent)] text-[var(--color-secondary)] rounded-xl p-2 mt-8 flex flex-row items-center"
            onClick={() => navigate("/new-note")}
          >
            <h1 className="text-lg mr-3">New Note </h1>
            <span className="material-symbols-outlined">note_stack</span>
          </button>
        </div>
        <div
          id="history-container"
          className="cotainer mt-5 mx-5 flex flex-col gap-1 w-[80%] flex-grow"
        >
          {error && <div className="mb-2 text-red-400 text-sm">{error}</div>}
          {historyRows}
        </div>
        <div className="mx-5 mb-10 mt-auto">
          <button
            className="text-[var(--color-text)] rounded-xl p-2 flex flex-row items-center justify-center"
            onClick={handleLogout}
          >
            <h1 className="text-lg mr-3">Logout</h1>
            <span className="material-symbols-outlined">logout</span>
          </button>
          {logoutError && (
            <div className="mt-2 text-red-400 text-sm">{logoutError}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
