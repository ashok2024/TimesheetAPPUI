import { useEffect, useState } from "react";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import axiosInstance from "../../utils/axiosInstance";

function TaskTrendChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: {} });

  useEffect(() => {
    axiosInstance.get("/dashboard/task-trends").then((res) => {
      debugger;
      const labels = res.data.map((item) => item.date.slice(0, 10));
      const data = res.data.map((item) => item.taskCount);

      setChartData({
        labels,
        datasets: {
          label: "Tasks",
          data,
        },
      });
    });
  }, []);

  return (
    <ReportsBarChart
      color="dark"
      title="Task Trends"
      description="Tasks created per week"
      date="Updated weekly"
      chart={chartData}
    />
  );
}

export default TaskTrendChart;
