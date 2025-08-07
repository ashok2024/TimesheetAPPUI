import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    OutlinedInput,
    Checkbox,
    ListItemText,
    IconButton,
    FormHelperText,
    Box,
    Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getTaskById, addTask, updateTask } from "api/taskService";
import { getUsers,getUsersByProjectId } from "api/userService";
import { useSnackbar } from "notistack";
import { Divider } from "@mui/material";

const statusOptions = ["Pending", "In Progress", "Completed"];

function TaskModal({ open, onClose, projectId, taskId }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        dueDate: "",
        status: "Pending",
        userIds: [],
        file: null,
    });

    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [fileError, setFileError] = useState("");

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const fetchUsers = async () => {
        //const data = await getUsers();
            const assignedUsers = await getUsersByProjectId(projectId);
            setUsers(assignedUsers);
            // setUsers(data);
    };

    const fetchTask = async () => {
        if (taskId) {
            const task = await getTaskById(taskId);
            setFormData({
                name: task.name || "",
                description: task.description || "",
                dueDate: task.dueDate?.slice(0, 10) || "",
                userIds: task.assignedUsers?.map((u) => u.id) || [],
                status: task.status || "Pending",
                file: null,
            });
        }
    };

    useEffect(() => {
        fetchUsers();
        if (taskId) fetchTask();
        else
            setFormData({
                name: "",
                description: "",
                dueDate: "",
                status: "Pending",
                userIds: [],
                file: null,
            });
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAssignedToChange = (event) => {
        const { value } = event.target;
        setFormData((prev) => ({
            ...prev,
            userIds: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Task name is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        if (!formData.status) newErrors.status = "Status is required";
        if (!formData.userIds.length) newErrors.userIds = "At least one user must be assigned";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = new FormData();
        payload.append("Name", formData.name);
        payload.append("Description", formData.description || "");
        payload.append("DueDate", new Date(formData.dueDate).toISOString());
        payload.append("Status", formData.status);
        payload.append("ProjectId", projectId);
        formData.userIds.forEach((id) => payload.append("UserIds", id));
        if (formData.file) {
            if (formData.file.size > 5 * 1024 * 1024) {
                enqueueSnackbar("File size must be less than 5MB", { variant: "error" });
                return;
            }
            payload.append("File", formData.file);
        }

        try {
            if (taskId) {
                await updateTask(taskId, payload);
                enqueueSnackbar("Task updated successfully", { variant: "success" });
            } else {
                await addTask(payload);
                enqueueSnackbar("Task created successfully", { variant: "success" });
            }
            onClose();
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Failed to save task", { variant: "error" });
        }
    };
    const handleFileChange = (e) => {
        debugger;
        const file = e.target.files[0];

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrors((prev) => ({ ...prev, file: "File size must be less than 5MB" }));
                setFormData((prev) => ({ ...prev, file: null }));
                return;
            } else {
                setErrors((prev) => ({ ...prev, file: undefined }));
                setFormData((prev) => ({ ...prev, file }));
            }
        } else {
            // Clear file if user cancels file picker
            setFormData((prev) => ({ ...prev, file: null }));
            setErrors((prev) => ({ ...prev, file: undefined }));
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {taskId ? "Edit Task" : "Add Task"}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Task Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    required
                />

                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                />

                <TextField
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dueDate}
                    helperText={errors.dueDate}
                    fullWidth
                />

                <FormControl fullWidth error={!!errors.userIds}>
                    <InputLabel>Assign Users</InputLabel>
                    <Select
                        multiple
                        value={formData.userIds}
                        onChange={handleAssignedToChange}
                        input={<OutlinedInput label="Assign Users" sx={{ mt: 1, lineHeight: "3.4375em" }} />}
                        renderValue={(selected) =>
                            users
                                .filter((u) => selected.includes(u.id))
                                .map((u) => u.fullName)
                                .join(", ")
                        }
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                <Checkbox checked={formData.userIds.includes(user.id)} />
                                <ListItemText primary={user.fullName} />
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.userIds && <FormHelperText>{errors.userIds}</FormHelperText>}
                </FormControl>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Status Dropdown */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.status}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Status"
                                sx={{ lineHeight: "3.4375em" }}
                            >
                                {statusOptions.map((s) => (
                                    <MenuItem key={s} value={s}>
                                        {s}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    {/* File Upload */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.file || !!fileError}>
                            <Button
                                variant="contained"
                                color="primary"
                                component="label"
                                sx={{ color: "#fff" }}
                            >
                                Upload File
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    hidden
                                    onChange={handleFileChange} 
                                />
                            </Button>

                            {formData.file && (
                                <Box sx={{ mt: 1, fontSize: 14 }}>Selected: {formData.file.name}</Box>
                            )}

                            {(fileError || errors.file) && (
                                <FormHelperText>
                                    {fileError || errors.file}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ pr: 3, pb: 2 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ color: "#fff" }}
                >
                    {taskId ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TaskModal;
