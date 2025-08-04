import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { addTimeLog } from "api/timeLogService";
import { getUserId } from "../../utils/jwtUtils";

function AddTimesheetModal({ open, onClose, taskId, projectId }) {
  const [formData, setFormData] = useState({
    userId: "",
    projectId,
    taskId,
    workDate: "",
    hoursWorked: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
        debugger;
      const token = localStorage.getItem("token");
      const userId = getUserId(token);
      setFormData((prev) => ({
        ...prev,
        userId,
        projectId,
        taskId,
      }));
    }
  }, [open, projectId, taskId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.workDate) newErrors.workDate = "Work date is required";
    if (!formData.hoursWorked || isNaN(formData.hoursWorked))
      newErrors.hoursWorked = "Valid hours are required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await addTimeLog(formData);
      handleClose();
    } catch (err) {
      console.error("Failed to add time log:", err);
    }
  };

  const handleClose = () => {
    setFormData({
      userId: formData.userId,
      projectId,
      taskId,
      workDate: "",
      hoursWorked: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Add Time Log
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Work Date"
              name="workDate"
              InputLabelProps={{ shrink: true }}
              value={formData.workDate}
              onChange={handleChange}
              error={!!errors.workDate}
              helperText={errors.workDate}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Hours Worked"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
              error={!!errors.hoursWorked}
              helperText={errors.hoursWorked}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Log
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTimesheetModal;
