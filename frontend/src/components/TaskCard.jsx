function TaskCard({ title, description, duedate }) {
  return (
    <div className="bg-white p-3 rounded shadow mb-3">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-sm text-gray-600 mt-1">{duedate}</p>
    </div>
  );
}

export default TaskCard;