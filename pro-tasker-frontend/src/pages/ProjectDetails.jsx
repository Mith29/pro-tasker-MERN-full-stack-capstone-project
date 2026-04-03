import { useEffect, useState } from "react";
import { projectClient } from "../clients/api";
import TaskCard from "../components/TaskCard";
import ProjectCard from "../components/ProjectCard";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchCard from "../components/SearchCard";
import TaskStatusCard from "../components/TaskStatusCard";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setFilteredTasks(tasksData);
        setError(null);
      } catch (err) {
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
      const { data } = await projectClient.post(`/${projectId}/tasks`, {
        title,
        description,
        status,
      });
      const updatedTasks = [data, ...tasks];
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <>
     

    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
{/* Page Header */}
        <div className="text-center md:text-left mb-6">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            {project?.name || "Project Dashboard"}
          </h1>
          <p className="text-gray-600 text-lg">
            Track tasks, monitor progress, and manage your project effectively.
          </p>
        </div>
        {/* Header & New Task */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <ProjectCard project={project} variant="details" />
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            + New Task
          </button>
        </div>

     {/* Search */}
        <div >
          <SearchCard
            data={tasks}
            onFilter={setFilteredTasks}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        {/* Task Progress */}
        <div >
          <TaskStatusCard tasks={tasks} />
        </div>

   

        {/* Tasks Section */}
        <div>
          <h2 className="text-2xl font-bold mb-5">
            {searchQuery ? "Search Results" : "Tasks"}
          </h2>

          {searchQuery ? (
            filteredTasks.length === 0 ? (
              <p className="text-gray-500 text-lg">No tasks found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} setTasks={setTasks} />
                ))}
              </div>
            )
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 text-lg">No tasks available.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} setTasks={setTasks} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full mt-2 px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 h-28"
                  placeholder="Task description"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default ProjectDetails;