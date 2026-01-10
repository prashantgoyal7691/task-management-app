import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskColumn from "../components/TaskColumn";
import AddTaskModal from "../components/AddTaskModal";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");


  if (token) {
    const user = jwtDecode(token);
    console.log("Decoded user:", user);
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load tasks");
      }
    };

    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleStatusChange = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };


  return (
    <div className="min-h-screen bg-gray-100 pt-10">

      <Navbar />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* 🔹 ADD TASK BUTTON */}
      <div className="pt-20 px-6">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Task
        </button>

        {/* 🔹 TASK COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn
            title="Todo"
            tasks={tasks.filter((t) => t.status === "Todo")}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />

          <TaskColumn
            title="In Progress"
            tasks={tasks.filter((t) => t.status === "In Progress")}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />

          <TaskColumn
            title="Done"
            tasks={tasks.filter((t) => t.status === "Done")}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>

      {/* 🔹 ADD TASK MODAL */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}

export default Dashboard;
