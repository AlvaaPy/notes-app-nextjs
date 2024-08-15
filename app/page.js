"use client";

import { useEffect, useState } from "react";
import { FiTrash2  } from "react-icons/fi";
import { BsMoon, BsSun } from "react-icons/bs";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false); 

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
      console.log(data);
    } catch (error) {
      console.error("Gagal mendapatkan catatan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !body) return;
    try {
      const method = selectedNote ? "PUT" : "POST";
      const url = selectedNote ? `/api/notes/${selectedNote.id}` : "/api/notes";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });
      await res.json();
      fetchNotes();
      setTitle("");
      setBody("");
      setSelectedNote(null);
    } catch (error) {
      console.error("Gagal menyimpan catatan:", error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setBody(note.body);
    setSelectedNote(note);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Error deleting note:', errorData.error);
          return;
      }

      const result = await response.json();
      console.log(result.message);
      location.reload();
  } catch (error) {
      console.error('Network or other error:', error);
  }
  };

  const truncate = (str, length) => {
    return str.length > length ? str.slice(0, length) + "..." : str;
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <main
      className={`flex h-screen ${
        isNightMode ? "bg-gray-900 text-gray-100" : "bg-white text-black"
      }`}
    >
      <div
        className={`w-1/4 ${
          isNightMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
        } border-r-4 p-4 h-full flex flex-col`}
      >
        <div className="border-b-4 mb-4">
          <h1 className="text-2xl font-bold mb-4 text-center">List Notes</h1>
        </div>
        <div className="flex-grow overflow-y-auto shadow-sm rounded">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-center">Tidak ada catatan</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`mb-4 p-4 ${
                  isNightMode ? "bg-gray-700" : "bg-white"
                } rounded shadow cursor-pointer`}
                onClick={() => handleEdit(note)}
              >
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold">
                    {truncate(note.title, 7)}
                  </h2>
                  <p className="text-xs">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <p>{truncate(note.body, 20)}</p>
                <div className="flex justify-between space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                    className="text-blue-500 cursor-pointer"
                  >
                    Edit
                  </button>
                  <FiTrash2
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={toggleNightMode}
            className="p-2 rounded bg-blue-500 text-white flex items-center justify-center"
          >
            {isNightMode ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>
        </div>
      </div>
      <div className={`w-3/4 h-full ${isNightMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="w-full max-w-lg pl-6">
          <div className="mb-4 pt-6 flex flex-col items-start">
            <input
              placeholder="Enter Title Here"
              className="p-2 w-[900px] text-black rounded mb-2 text-2xl font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Add Notes Here"
              className="p-2 w-[900px] rounded text-black h-[490px] resize-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
        <div
          className={`w-full p-2 flex justify-between items-center ${
            isNightMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="pl-5">{body.length} characters</div>
          <div>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white p-2 rounded"
            >
              {selectedNote ? "Update" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

