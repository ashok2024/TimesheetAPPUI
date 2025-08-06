import { useEffect, useState } from "react";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import axiosInstance from "../../utils/axiosInstance";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function TimePerProjectChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ label: "Hours", data: [] }] });
  const [filter, setFilter] = useState("all");

  const fetchData = (filterValue) => {
    axiosInstance
      .get(`/dashboard/hours-per-project?range=${filterValue}`)
      .then((res) => {
        const labels = res.data.map((item) => item.projectName.trim());
        const data = res.data.map((item) => item.totalHours);
        setChartData({
          labels,
          datasets: [{ label: "Hours", data }],
        });
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  return (
    <>
      {/* <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="filter-label">Time Range</InputLabel>
        <Select
          labelId="filter-label"
          value={filter}
          label="Time Range"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="last7">Last 7 Days</MenuItem>
          <MenuItem value="last30">Last 30 Days</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl> */}

      <ReportsBarChart
        color="info"
        title="Time Spent Per Project"
        description={`Total hours logged per project - ${filter}`}
        date="Updated just now"
        chart={chartData}
        height={Math.max(chartData.labels.length * 20, 400)}  // Dynamically adjusts height
      />
    </>
  );
}

export default TimePerProjectChart;
