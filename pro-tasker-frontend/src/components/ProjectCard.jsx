import { useState } from "react";
import { projectClient } from "../clients/api.js";
import { useGlobalState } from "../context/GlobalStateContext.jsx";
import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

function ProjectCard({ project, setProjects, variant = "dashboard" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");

  const { setLoading, setError } = useGlobalState();
  const date = project?.createdAt ? new Date(project.createdAt) : null;

  // Update project
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectClient.put(`/${project._id}`, { name, description });
      setProjects((prev) => prev.map((p) => (p._id === project._id ? data : p)));
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    setError(null);
    try {
      await projectClient.delete(`/${project._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition relative">
  {/* Project Info */}
  <Link to={`/projectDetails/${project._id}`} className="block mb-2">
    <h3 className="text-lg font-bold text-gray-800 hover:text-blue-500 transition">
      {project.name}
    </h3>
  </Link>
  <p className="text-gray-600 mb-4">{project.description}</p>

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
        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Project</h3>

        <div className="flex flex-col gap-3 mb-4">
          <label className="text-gray-700">Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <label className="text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            rows={4}
          />
        </div>

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

export default ProjectCard;