import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Grid,
  Button,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { getTimeLogsByTaskAndUser, updateTimeLog, addTimeLog } from "api/timeLogService";
import { getProjectsByUserId } from "api/projectService";
import { getAllTasksByProjectId } from "api/taskService";
import { getUserId } from "utils/jwtUtils";

function ViewLogsModal({ open, onClose }) {
  const [logs, setLogs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [userId, setUserId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (open) {
      const token = localStorage.getItem("token");
      const uid = getUserId(token);
      setUserId(uid);
      fetchProjects(uid);
      setLogs([]); // Start empty when opening
      setEditIndex(null);
    }
  }, [open]);

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

  const handleChange = (index, field, value) => {
    const updated = [...logs];
    updated[index][field] = value;
    setLogs(updated);

    if (field === "projectId") {
      fetchTasks(value);
      updated[index].taskId = "";
    }
  };

  const handleSaveNew = async (log) => {
    try {
      await addTimeLog(log);
      setEditIndex(null);
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const handleAddLog = () => {
    const newLog = {
      id: 0,
      projectId: "",
      taskId: "",
      userId,
      workDate: new Date().toISOString().slice(0, 10),
      hoursWorked: 0,
      description: "",
      isNew: true,
    };
    setLogs([newLog, ...logs]);
    setEditIndex(0);
  };

  const handleRemoveRow = (index) => {
    const updated = [...logs];
    updated.splice(index, 1);
    setLogs(updated);
    if (editIndex === index) setEditIndex(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        View Time Logs
        <Tooltip title="Close">
          <IconButton onClick={onClose} style={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Log">
          <IconButton
            color="info"
            onClick={handleAddLog}
            style={{ float: "right", marginRight: 10 }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        {logs.length === 0 && (
          <p style={{ textAlign: "center", margin: "10px 0" }}>
            No timesheet available. Add your timesheet.
          </p>
        )}

        {logs.map((log, i) => {
          const isEditing = editIndex === i;
          return (
            <Grid container spacing={2} key={i} sx={{ mb: 2, alignItems: "center" }}>
              {/* Project dropdown */}
              <Grid item xs={2}>
                <Select
                  fullWidth
                  value={log.projectId}
                  onChange={(e) => handleChange(i, "projectId", e.target.value)}
                  disabled={!isEditing}
                  displayEmpty
                  sx={{ lineHeight: "3.5em" }}
                >
                  <MenuItem value="">Select Project</MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Task dropdown */}
              <Grid item xs={2}>
                <Select
                  fullWidth
                  value={log.taskId}
                  onChange={(e) => handleChange(i, "taskId", e.target.value)}
                  disabled={!isEditing || !log.projectId}
                  displayEmpty
                  sx={{ lineHeight: "3.5em" }}
                >
                  <MenuItem value="">Select Task</MenuItem>
                  {tasks.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Date */}
              <Grid item xs={2}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={log.workDate?.slice(0, 10)}
                  onChange={(e) => handleChange(i, "workDate", e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>

              {/* Hours */}
              <Grid item xs={1.5}>
                <TextField
                  label="Hours"
                  type="number"
                  fullWidth
                  value={log.hoursWorked}
                  onChange={(e) => handleChange(i, "hoursWorked", e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={2.5}>
                <TextField
                  label="Description"
                  fullWidth
                  value={log.description}
                  onChange={(e) => handleChange(i, "description", e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>

              {/* Buttons inline */}
              <Grid item xs="auto" sx={{ display: "flex", gap: 1 }}>
                {isEditing ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ color: "#fff" }}
                    onClick={() => handleSaveNew(log)}
                  >
                    {log.isNew ? "Save" : "Update"}
                  </Button>
                ) : (
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setEditIndex(i)} sx={{ color: "blue" }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {log.isNew && (
                  <Tooltip title="Remove">
                    <IconButton color="error" onClick={() => handleRemoveRow(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}

export default ViewLogsModal;
