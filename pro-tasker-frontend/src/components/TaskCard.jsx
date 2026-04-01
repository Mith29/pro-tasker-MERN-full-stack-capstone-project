import { useState } from "react";
import { taskClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";


function TaskCard({ task, setTasks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const date = new Date(task.createdAt);

  const { setLoading, setError } = useGlobalState();

  // Update task
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await taskClient.put(`/${task._id}`, {
        title,
        description,
        status,
      });

      setTasks((prev) => prev.map((t) => (t._id === task._id ? data : t)));
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    setError(null);
    try {
      await taskClient.delete(`/${task._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition relative">
  {/* Task Info */}
  <h3 className="text-lg font-bold text-gray-800 mb-1">{task.title}</h3>
  <p className="text-gray-600 mb-2">{task.description}</p>

  {/* Status Badge */}
  <div className="inline-block mb-2">
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${
        task.status === "To Do"
          ? "bg-gray-300 text-gray-800"
          : task.status === "In Progress"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-green-200 text-green-800"
      }`}
    >
      {task.status}
    </span>
  </div>

  {/* Created At */}
  <div className="text-gray-500 text-sm mb-2">
    Created at: {date.toLocaleDateString()} {date.toLocaleTimeString()}
  </div>

  {/* Project Name */}
  <h4 className="text-gray-700 font-medium mb-3">Project: {task.project.name}</h4>

  {/* Action Buttons */}
  <div className="flex gap-2">
    <button
      onClick={() => setIsModalOpen(true)}
    >
          <PencilIcon className="h-7 w-5 text-blue-500 hover:text-blue-800 transition"/>
    </button>
    <button
      onClick={handleDelete}
    >
                        <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-800 transition"/>

    </button>
  </div>

  {/* Edit Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Task</h3>

        <div className="flex flex-col gap-3 mb-4">
          {/* Title */}
          <label className="text-gray-700">Title:</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Description */}
          <label className="text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            rows={3}
          />

          {/* Status */}
          <label className="text-gray-700">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

export default TaskCard;