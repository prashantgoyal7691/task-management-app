import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function History() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("completed");
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/tasks/history");
        setTasks(res.data);
      } catch (err) {
        setError("Failed to load history");
      }
    };
    fetchHistory();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "completed") {
      return task.status === "Done" && !task.abandoned;
    }
    if (activeTab === "abandoned") {
      return task.abandoned === true;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Task History (Completed vs Abandoned)
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            ←
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded ${
              activeTab === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            ✅ Completed
          </button>

          <button
            onClick={() => setActiveTab("abandoned")}
            className={`px-4 py-2 rounded ${
              activeTab === "abandoned"
                ? "bg-red-600 text-white"
                : "bg-gray-200"
            }`}
          >
            ❌ Abandoned
          </button>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No history available
                </td>
              </tr>
            )}

            {filteredTasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="p-2">{task.title}</td>
                <td className="p-2 text-center">{task.status}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="bg-blue-400 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
                  >
                    👁 View Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-3">Task Details</h3>

            <p>
              <strong>Title:</strong> {selectedTask.title}
            </p>
            <p className="mt-1">
              <strong>Description:</strong> {selectedTask.description || "—"}
            </p>

            <p className="mt-2">
              <strong>Created:</strong>{" "}
              {new Date(selectedTask.createdAt).toLocaleString()}
            </p>

            {selectedTask.completedAt && (
              <p className="mt-1">
                <strong>Completed:</strong>{" "}
                {new Date(selectedTask.completedAt).toLocaleString()}
              </p>
            )}

            {selectedTask.completedAt &&
              (() => {
                const diffMs =
                  new Date(selectedTask.completedAt) -
                  new Date(selectedTask.createdAt);

                const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
                const days = Math.floor(totalHours / 24);
                const hours = totalHours % 24;

                return (
                  <p className="mt-1">
                    <strong>Duration:</strong>{" "}
                    {days > 0 && `${days} day${days > 1 ? "s" : ""} `}
                    {hours} hour{hours !== 1 ? "s" : ""}
                  </p>
                );
              })()}

            {selectedTask.abandoned && (
              <p className="mt-2 text-red-600 font-semibold">❌ Abandoned</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
