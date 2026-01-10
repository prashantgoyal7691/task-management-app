import API from "../services/api";
import { useState } from "react";

function TaskColumn({ title, tasks, onStatusChange, onDelete }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDueDate, setEditDueDate] = useState("");
  const handleNext = async (taskId) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, {
        action: "next",
      });
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

      {[...tasks]
        .sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        })
        .map((task) => {
          const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== "Done";
          let overdueDays = 0;
          const isEditing = editingTaskId === task._id;

          if (isOverdue) {
            const today = new Date();
            const due = new Date(task.dueDate);

            today.setHours(0, 0, 0, 0);
            due.setHours(0, 0, 0, 0);

            overdueDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
          }

          return (
            <div
              key={task._id}
              className={`border p-3 rounded mb-3 flex justify-between items-start ${
                isOverdue ? "border-red-500 bg-red-50" : ""
              }`}
            >
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
                {isEditing ? (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="border p-1 text-xs rounded"
                    />
                    <button
                      onClick={async () => {
                        try {
                          const res = await API.put(`/tasks/${task._id}`, {
                            dueDate: editDueDate || null,
                          });
                          onStatusChange(res.data);
                          setEditingTaskId(null);
                        } catch (error) {
                          console.error("Failed to update due date");
                        }
                      }}
                      className="text-xs text-green-600 underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-xs text-gray-500 underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  task.dueDate && (
                    <p
                      className={`text-xs mt-1 ${
                        isOverdue
                          ? "text-red-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {isOverdue
                        ? `⚠ Overdue by ${overdueDays} day${
                            overdueDays > 1 ? "s" : ""
                          }`
                        : `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                    </p>
                  )
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
                      onClick={() => {
                        setEditingTaskId(task._id);
                        setEditDueDate(
                          task.dueDate ? task.dueDate.slice(0, 10) : ""
                        );
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      ✏️ Edit Due Date
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
          );
        })}
    </div>
  );
}

export default TaskColumn;
