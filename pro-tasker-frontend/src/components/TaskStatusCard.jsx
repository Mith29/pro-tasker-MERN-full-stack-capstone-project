import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useCalculate } from "../hooks/useCalculate";

// Theme colors
const STATUS_COLORS = {
  Done: "#76a5f1",        
  "In Progress": "#0c0f9c", 
  "To Do": "#8866d8",     
};

const TaskStatusCard = ({ tasks }) => {
  const { percentage, statusCounts } = useCalculate({ tasks });

  const data = Object.keys(STATUS_COLORS).map((status) => ({
    name: status,
    value: statusCounts[status] || 0,
  }));

  const totalTasks = tasks.length;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Task Progress</h2>
      <p className="text-gray-600 mb-4">
        Total Tasks: <span className="font-semibold">{totalTasks}</span>
      </p>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div style={{ width: "100%", maxWidth: 250, height: 250, position: "relative" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60} 
                label={false}
                isAnimationActive={true}
                animationDuration={1000} // 1 second
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} task${value !== 1 ? "s" : ""}`}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "none",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered completion % */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-lg md:text-xl font-bold text-gray-800">{percentage}%</span>
          </div>
        </div>

        {/* Status Legends / Bulletins */}
        <div className="flex flex-col gap-3">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[entry.name] }}
              />
              <span className="text-gray-700 font-medium">
                {entry.name}: {entry.value} task{entry.value !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusCard;