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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { getTimeLogsByTaskAndUser, updateTimeLog, addTimeLog } from "api/timeLogService";
import { getUserId } from "utils/jwtUtils";

function ViewLogsModal({ open, onClose, taskId, projectId }) {
    const [logs, setLogs] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (open && taskId) {
            const token = localStorage.getItem("token");
            const uid = getUserId(token);
            setUserId(uid);
            fetchLogs(taskId, uid);
        }
    }, [open, taskId]);

    const fetchLogs = async (taskId) => {
        try {
            const data = await getTimeLogsByTaskAndUser(taskId);
            setLogs(data);
            setEditIndex(null);
        } catch (err) {
            console.error("Error fetching timesheets:", err);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...logs];
        updated[index][field] = value;
        setLogs(updated);
    };

    const handleUpdate = async (log) => {
        try {
            await updateTimeLog(log.id, log);
            await fetchLogs(taskId, userId);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleSaveNew = async (log) => {
        try {
            await addTimeLog(log);
            await fetchLogs(taskId, userId);
        } catch (err) {
            console.error("Add failed", err);
        }
    };

    const handleAddLog = () => {
        if (!projectId || projectId === 0) {
            console.error("Invalid projectId when adding log");
            return;
        }

        const newLog = {
            id: 0,
            taskId,
            projectId,
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                {logs.map((log, i) => {
                    const isEditing = editIndex === i;
                    return (
                        <Grid container spacing={2} key={i} sx={{ mb: 2, alignItems: "center" }}>
                            <Grid item xs={3}>
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
                            <Grid item xs={2}>
                                <TextField
                                    label="Hours"
                                    type="number"
                                    fullWidth
                                    value={log.hoursWorked}
                                    onChange={(e) => handleChange(i, "hoursWorked", e.target.value)}
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    value={log.description}
                                    onChange={(e) => handleChange(i, "description", e.target.value)}
                                    InputProps={{ readOnly: !isEditing }}
                                />
                            </Grid>
                            <Grid item xs={3} sx={{ display: "flex", gap: 1 }}>
                                {isEditing ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        sx={{ color: "#fff" }}
                                        onClick={() =>
                                            log.isNew ? handleSaveNew(log) : handleUpdate(log)
                                        }
                                    >
                                        {log.isNew ? "Save" : "Update"}
                                    </Button>
                                ) : (
                                    <Tooltip title="Edit">
                                        <IconButton
                                            onClick={() => setEditIndex(i)}
                                            sx={{ color: "blue" }}
                                        >
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
