import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useGlobalState } from "../context/GlobalStateContext";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { loading, setLoading, error, setError } = useGlobalState();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const { data } = await projectClient.get("/");
        setProjects(data);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await projectClient.post("/", { name, description });
      setProjects([data, ...projects]);
      setName("");
      setDescription("");
      setError(null);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-4xl mx-auto">

    {/* Header */}
    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
      Project Dashboard
    </h1>

    {/* Add Project Form */}
    <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a Project</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-gray-600 mb-1">Name:</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Project Name"
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
            placeholder="Project Description"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            rows={4}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Project
        </button>
      </form>
    </div>

    {/* Projects List */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          setProjects={setProjects}
          variant="dashboard"
        />
      ))}
    </div>
  </div>
</div>
  );
}

export default Dashboard;