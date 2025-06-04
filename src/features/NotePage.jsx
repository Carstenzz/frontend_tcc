import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import Sidebar from "../components/Sidebar";
import { getAxiosInstance } from "../controller/axiosInstance";

function NotePage() {
  let { id } = useParams();
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  let [editMode, setEditMode] = useState(false);
  let [expire, setExpire] = useState("");
  let [token, setToken] = useState("");
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const axiosInstance = getAxiosInstance({
    expire,
    setExpire,
    setToken,
    navigate,
    BASE_URL,
  });

  const updateNoteOnPage = async () => {
    const data = {
      id: id,
      title: title,
      content: content,
    };
    try {
      document.getElementById(id).innerText = title;
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

  const deleteNoteOnPage = async () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}/notes`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const note = data.notes.find((note) => note.id == id);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
        }
      } catch (err) {
        // Redirect to /login if error is any 4xx
        if (err?.response?.status >= 400 && err?.response?.status < 500) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <div className="flex w-full h-screen">
        <Sidebar currentID={id} />
        <div className="bg-[var(--color-primary)] w-full min-w-52 flex flex-col items-center h-full pt-10 pb-20 px-20">
          {editMode ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[var(--color-text)] text-4xl mb-15 p-2 text-center outline-none"
              maxLength={20}
            />
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[var(--color-text)] text-4xl mb-15 p-2 text-center outline-none"
              disabled
            />
          )}
          <div className="md-container w-full h-full resize-none bg-[var(--color-tertiary)] rounded-2xl p-10 text-[var(--color-text)] outline-none overflow-y-auto">
            {editMode ? (
              <textarea
                name="note"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                id="note"
                className="w-full h-[98%] resize-none bg-[var(--color-tertiary)] text-[var(--color-text)] outline-none"
              ></textarea>
            ) : (
              <Markdown>{content}</Markdown>
            )}
          </div>
          {editMode ? (
            <div className="flex flex-row justify-center gap-10 w-full">
              <button
                className="bg-[var(--color-accent)] rounded-xl p-2 mt-8 w-30 text-[var(--color-primary)]"
                onClick={() => {
                  updateNoteOnPage();
                  setEditMode(false);
                }}
              >
                Save
              </button>
              <button
                className="bg-red-500 rounded-xl p-2 mt-8 w-30 text-[var(--color-text)]"
                onClick={() => deleteNoteOnPage()}
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              className="bg-[var(--color-accent)] rounded-xl p-2 mt-8 w-30"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default NotePage;
