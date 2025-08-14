import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  Tooltip,
  Select,
  MenuItem,
  TextField,
  Card,
  CardHeader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import {
  getTimeLogsByTaskAndUser,
  addTimeLog,
  getTimeLogsByUser,
  exportTimeLogByuser,
} from "api/timeLogService";
import { getProjectsByUserId } from "api/projectService";
import { getAllTasksByProjectId } from "api/taskService";
import { getUserId } from "utils/jwtUtils";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DownloadIcon from "@mui/icons-material/Download";
export default function Timesheet() {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newLog, setNewLog] = useState(null);
  const [userId, setUserId] = useState(null);

  const logColumns = [
    { Header: "Project Name", accessor: "projectName" },
    { Header: "Task Name", accessor: "taskName" },
    { Header: "Description", accessor: "description" },
    { Header: "Hours", accessor: "hours" }, // match backend "hours"
    { Header: "Date", accessor: "logDate" }, // match backend "logDate"
  ];
  const logRows = logs.map((log) => ({
    projectName: log.projectName || "—",
    taskName: log.taskName || "—",
    description: log.description || "—",
    hours: log.hours, // match accessor
    logDate: log.logDate?.slice(0, 10), // match accessor, format to YYYY-MM-DD
  }));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = getUserId(token);
    setUserId(uid);
    fetchProjects(uid);
    fetchLogs(uid);
  }, []);

  const fetchProjects = async (uid) => {
    try {
      const data = await getProjectsByUserId(uid);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const data = await getAllTasksByProjectId(projectId);
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchLogs = async (uid) => {
    try {
      const data = await getTimeLogsByUser(uid);
      debugger;
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const handleAddClick = () => {
    setNewLog({
      projectId: "",
      taskId: "",
      userId,
      workDate: new Date().toISOString().slice(0, 10),
      hoursWorked: 0,
      description: "",
    });
  };

  const handleChangeNew = (field, value) => {
    setNewLog((prev) => ({ ...prev, [field]: value }));
    if (field === "projectId") {
      fetchTasks(value);
      setNewLog((prev) => ({ ...prev, taskId: "" }));
    }
  };

  const handleSaveNew = async () => {
    try {
      await addTimeLog(newLog);
      await fetchLogs(userId); // refresh data from backend so table is accurate
      setNewLog(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };
  const handleExportCsv = async () => {
    try {
      const response = await exportTimeLogByuser(userId); // Pass only the userId
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `timelogs_user_${userId}.csv`);
    } catch (error) {
      console.error("CSV Export Failed:", error);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box>
        {newLog && (
          <Card sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={2} sx={{ mt: 1, mb: 2, ml: 1, alignItems: "center" }}>
              <Grid item xs={2}>
                <Select
                  fullWidth
                  value={newLog.projectId}
                  onChange={(e) => handleChangeNew("projectId", e.target.value)}
                  displayEmpty
                  sx={{ lineHeight: "3.4375em" }}
                >
                  <MenuItem value="">Select Project</MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={2}>
                <Select
                  fullWidth
                  value={newLog.taskId}
                  onChange={(e) => handleChangeNew("taskId", e.target.value)}
                  disabled={!newLog.projectId}
                  displayEmpty
                  sx={{ lineHeight: "3.4375em" }}
                >
                  <MenuItem value="">Select Task</MenuItem>
                  {tasks.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  type="date"
                  fullWidth
                  value={newLog.workDate}
                  onChange={(e) => handleChangeNew("workDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  type="number"
                  fullWidth
                  value={newLog.hoursWorked}
                  onChange={(e) => handleChangeNew("hoursWorked", e.target.value)}
                />
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  fullWidth
                  value={newLog.description}
                  onChange={(e) => handleChangeNew("description", e.target.value)}
                />
              </Grid>
              <Grid item xs="auto" sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ color: "#fff" }}
                  startIcon={<SaveIcon />}
                  onClick={handleSaveNew}
                >
                  Save
                </Button>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => setNewLog(null)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Logs Table */}
        <Card sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Time Log</Typography>
            <Box display="flex" alignItems="center">
              {" "}
              {/* This new Box will group the buttons */}
              <Tooltip title="Export CSV">
                <IconButton color="primary" onClick={handleExportCsv}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add New Entry">
                <IconButton color="primary" onClick={handleAddClick} disabled={!!newLog}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {logs.length > 0 ? (
            <DataTable
              table={{ columns: logColumns, rows: logRows }}
              isSorted={true}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          ) : (
            <Typography textAlign="center">No timesheet available. Add your timesheet.</Typography>
          )}
        </Card>
      </Box>
    </DashboardLayout>
  );
}
