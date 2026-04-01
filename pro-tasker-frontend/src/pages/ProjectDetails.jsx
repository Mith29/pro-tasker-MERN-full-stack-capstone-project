import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import TaskCard from "../components/TaskCard";
import ProjectCard from "../components/ProjectCard";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");

  const { projectId } = useParams();
  const { loading, setLoading, error, setError } = useGlobalState();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data: projectData } = await projectClient.get(`/${projectId}`);
        setProject(projectData);

        const { data: tasksData } = await projectClient.get(`/${projectId}/tasks`);
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to fetch project or tasks");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await projectClient.post(`/${projectId}/tasks`, { title, description, status });
      setTasks([data, ...tasks]);
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-4xl mx-auto">

    {/* Project Card */}
    <div className="mb-8">
      <ProjectCard project={project} variant="details" />
    </div>

    {/* Task Section */}
    <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Task List</h1>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-gray-600 mb-1">Title:</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Task Title"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-gray-600 mb-1">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Task Description"
            rows={3}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-gray-600 mb-1">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Task
        </button>
      </form>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} setTasks={setTasks} />
        ))}
      </div>
    </div>
  </div>
</div>
  );
}

export default ProjectDetails;