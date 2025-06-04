import { useNavigate } from "react-router-dom";

export default function History({ id, title, currentID }) {
  const navigate = useNavigate();

  const changeURL = (id) => {
    navigate(`/${id}`);
  };

  return (
    <>
      {currentID == id ? (
        <button
          className="bg-[var(--color-tertiary)] rounded-xl p-2 w-full flex flex-row"
          onClick={() => changeURL(id)}
        >
          <h1
            id={id}
            className="text-[var(--color-text)] text-lg mr-3 truncate"
          >
            {title}
          </h1>
        </button>
      ) : (
        <button
          className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] rounded-xl p-2 w-full flex flex-row"
          onClick={() => changeURL(id)}
        >
          <h1
            id={id}
            className="text-[var(--color-text)] text-lg mr-3 truncate"
          >
            {title}
          </h1>
        </button>
      )}
    </>
  );
}
