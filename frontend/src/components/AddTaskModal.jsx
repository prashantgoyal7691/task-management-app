import { useState } from "react";
import API from "../services/api";

function AddTaskModal({ onClose, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = async () => {
    if (!title) {
      setError("Title is required");
      return;
    }

    try {
      const payload = { title, description };

      if (dueDate) {
        payload.dueDate = dueDate;
      }

      const res = await API.post("/tasks", payload);
      onTaskAdded(res.data);
      onClose();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Task</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            ✕
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default AddTaskModal;
