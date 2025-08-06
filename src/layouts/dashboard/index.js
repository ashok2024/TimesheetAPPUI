import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Dashboard components (your dynamic chart components)
import TimePerProjectChart from "./TimePerProjectChart";
import TaskTrendChart from "./TaskTrendChart";
import WeeklySummaryChart from "./WeeklySummaryChart";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* ✅ Replace with live chart for Hours Per Project */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={12} sx={{ overflowX: "auto" }}>
                <TimePerProjectChart />
              </MDBox>
            </Grid>

            {/* ✅ Replace with live chart for Task Trends */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <TaskTrendChart />
              </MDBox>
            </Grid>

            {/* ✅ Replace with live chart for Weekly Summary */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <WeeklySummaryChart />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
