import React, { useState, useEffect } from "react";
import { Grid, MenuItem, Button, TextField } from "@mui/material";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import axiosInstance from "../../utils/axiosInstance";

function GlobalFilterBar({ onFilterChange }) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // Load users and projects on mount
  useEffect(() => {
    axiosInstance.get("/users").then((res) => setUsers(res.data));
    axiosInstance.get("/projects").then((res) => setProjects(res.data));
  }, []);

  const handleApply = () => {
    onFilterChange({
      userId: selectedUser,
      projectId: selectedProject,
      startDate: dateRange[0] ? dateRange[0].toISOString() : null,
      endDate: dateRange[1] ? dateRange[1].toISOString() : null,
    });
  };

  return (
    <Grid container spacing={2} mb={2} alignItems="center">
      <Grid item xs={12} sm={4} md={3}>
        <DateRangePicker
          placeholder="Select date range"
          value={dateRange}
          onChange={setDateRange}
          style={{ width: "100%" }}
          format="yyyy-MM-dd"
        />
      </Grid>

      <Grid item xs={12} sm={4} md={3}>
        <TextField
          select
          fullWidth
          label="User"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <MenuItem value="">All Users</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.fullName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4} md={3}>
        <TextField
          select
          fullWidth
          label="Project"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <MenuItem value="">All Projects</MenuItem>
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={12} md={3}>
        <Button fullWidth variant="contained" onClick={handleApply}>
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
}

export default GlobalFilterBar;
