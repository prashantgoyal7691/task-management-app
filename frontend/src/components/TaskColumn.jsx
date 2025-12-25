import API from "../services/api";

function TaskColumn({ title, tasks, onStatusChange, onDelete }) {
  const handleNext = async (taskId) => {
    try {
      const res = await API.put(`/tasks/${taskId}`);
      onStatusChange(res.data);
    } catch (error) {
      console.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      onDelete(taskId);
    } catch (error) {
      console.error("Failed to delete task");
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}/complete`);
      onDelete(taskId); // remove from dashboard UI
    } catch (error) {
      console.error("Failed to complete task");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-3">{title}</h2>

      {tasks.length === 0 && <p className="text-sm text-gray-500">No tasks</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          className="border p-3 rounded mb-3 flex justify-between items-start"
        >
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {/* Todo & In Progress */}
            {task.status !== "Done" && (
              <>
                <button
                  onClick={() => handleNext(task._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                >
                  Next →
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  ❌ Delete
                </button>
              </>
            )}

            {/* Done */}
            {task.status === "Done" && (
              <button
                onClick={() => handleComplete(task._id)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              >
                ✔ Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskColumn;
