import { useEffect, useState } from "react";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import axiosInstance from "../../utils/axiosInstance";

function WeeklySummaryChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: {} });

 useEffect(() => {
  axiosInstance.get("/dashboard/weekly-summary").then((res) => {
    const labels = res.data.days.map((item) => item.dayOfWeek);
    const data = res.data.days.map((item) => item.totalHours);

    setChartData({
      labels,
      datasets: {
        label: "Hours",
        data,
      },
    });
  });
}, []);

  return (
    <ReportsBarChart
      color="primary"
      title="Weekly Summary"
      description="Weekly timesheet hour summary"
      date="Auto-refresh enabled"
      chart={chartData}
    />
  );
}

export default WeeklySummaryChart;
