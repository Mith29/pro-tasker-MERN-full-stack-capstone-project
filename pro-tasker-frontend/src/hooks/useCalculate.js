export const useCalculate = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return {
      percentage: 0,
      statusCounts: {
        "Done": 0,
        "In Progress": 0,
        "To Do": 0,
      },
    };
  }

  const total = tasks.length;

  let statusCounts = {
    "Done": 0,
    "In Progress": 0,
    "To Do": 0, // assuming any task not done or in progress is pending
  };

  const score = tasks.reduce((acc, task) => {
    if (task.status === "Done") {
      statusCounts.Done += 1;
      return acc + 1;
    }
    if (task.status === "In Progress") {
      statusCounts["In Progress"] += 1;
      return acc + 0.5;
    }
    statusCounts["To Do"] += 1;
    return acc;
  }, 0);

  const percentage = Math.round((score / total) * 100);

  return { percentage, statusCounts };
};