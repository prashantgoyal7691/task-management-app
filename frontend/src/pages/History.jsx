import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function History() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Task History (Completed vs Abandoned)
        </h2>
        <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            ←
        </button>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No history available
                </td>
              </tr>
            )}

            {tasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="p-2">{task.title}</td>
                <td className="p-2 text-center">{task.status}</td>
                <td className="p-2 text-center">
                  {task.status === "Done" && !task.abandoned ? (
                    <span className="text-green-600 font-semibold">
                      ✅ Completed
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      ❌ Abandoned
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
