import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Box,
  IconButton,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getTaskById } from "api/taskService";

function ViewTaskModal({ open, onClose, taskId }) {
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (open && taskId) {
      getTaskById(taskId).then((data) => setTask(data));
    }
  }, [open, taskId]);

  if (!task) return null;

  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(task.filePath || "");
  const isPDF = /\.pdf$/i.test(task.filePath || "");
  const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, "") || "";
  const fileUrl = `${baseUrl}/${task.filePath}`;

  const downloadFile = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = task.filePath.split("/").pop();
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>📄 View Task</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">{task.name}</Typography>            
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Total Hours Spent: {task?.totalHoursSpent}</Typography>         
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
            <Typography variant="body1">{task.description || "—"}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Typography variant="body1">{task.status || "—"}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">Due Date</Typography>
            <Typography variant="body1">{task.dueDate?.split("T")[0] || "—"}</Typography>
          </Grid>

         

          {task.filePath && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">Attached File</Typography>
              <Box mt={1}>
                {isImage ? (
                  <Paper elevation={2} sx={{ p: 1, textAlign: "center" }}>
                    <img
                      src={fileUrl}
                      alt="Task Attachment"
                      style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: 8 }}
                    />
                  </Paper>
                ) : isPDF ? (
                  <Paper elevation={2} sx={{ p: 1, textAlign: "center" }}>
                    <Typography variant="body2">PDF File Attached</Typography>
                  </Paper>
                ) : (
                  <Typography color="text.secondary">Unsupported file format.</Typography>
                )}
              </Box>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 1, color: "#fff" }}
                onClick={downloadFile}
                fullWidth
              >
                Download File
              </Button>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ViewTaskModal;
