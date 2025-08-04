import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Icon } from "@mui/material";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";

import { getProjectById } from "api/projectService";
import { getTasksByProjectId, deleteTask } from "api/taskService";

import TaskModal from "./TaskModal";
import ViewTaskModal from "./ViewTaskModal";
import AddTimesheetModal from "./AddTimesheetModal";
import ViewLogsModal from "./ViewLogsModal";
import Tooltip from "@mui/material/Tooltip";
function ProjectDetails() {
    const { id: projectIdParam } = useParams();
    const projectId = parseInt(projectIdParam, 10);

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openTimesheetModal, setOpenTimesheetModal] = useState(false);
    const [openLogsModal, setOpenLogsModal] = useState(false);

    const fetchProject = async () => {
        try {
            const data = await getProjectById(projectId);
            setProject(data);
        } catch (err) {
            console.error("Error fetching project:", err);
        }
    };

    const fetchTasks = async () => {
        try {
            const data = await getTasksByProjectId(projectId);
            setTasks(data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, [projectId]);

    const handleTaskAction = (action, taskId) => {
        if (action === "view") {
            setSelectedTaskId(taskId);
            setOpenViewModal(true);
        } else if (action === "edit") {
            setSelectedTaskId(taskId);
            setOpenTaskModal(true);
        } else if (action === "delete" && window.confirm("Are you sure to delete this task?")) {
            deleteTask(taskId).then(fetchTasks);
        } else if (action === "log") {
            setSelectedTaskId(taskId);
            setOpenTimesheetModal(true);
        } else if (action === "viewLogs") {
            setSelectedTaskId(taskId);
            setOpenLogsModal(true);
        }
    };

    const columns = [
        { Header: "Task Name", accessor: "name" },
        { Header: "Status", accessor: "status" },
        {
            Header: "Assigned Users",
            accessor: "assignedUserIds",
            Cell: ({ row }) =>
                row.original.assignedUserIds?.map((user) => user.fullName).join(", ") || "—",
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({ row }) => (
                <MDBox display="flex" gap={1}>
                    <Tooltip title="View Task">
                        <Icon
                            onClick={() => handleTaskAction("view", row.original.id)}
                            color="info"
                            style={{ cursor: "pointer" }}
                        >
                            visibility
                        </Icon>
                    </Tooltip>

                    <Tooltip title="Edit Task">
                        <Icon
                            onClick={() => handleTaskAction("edit", row.original.id)}
                            color="warning"
                            style={{ cursor: "pointer" }}
                        >
                            edit
                        </Icon>
                    </Tooltip>

                    <Tooltip title="Delete Task">
                        <Icon
                            onClick={() => handleTaskAction("delete", row.original.id)}
                            color="error"
                            style={{ cursor: "pointer" }}
                        >
                            delete
                        </Icon>
                    </Tooltip>

                    <Tooltip title="View Time Logs">
                        <Icon
                            onClick={() => handleTaskAction("viewLogs", row.original.id)}
                            color="primary"
                            style={{ cursor: "pointer" }}
                        >
                            watch_later
                        </Icon>
                    </Tooltip>
                </MDBox>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={4} px={3}>
                <Card sx={{ p: 3, mb: 3 }}>
                    <MDTypography variant="h5">Project Details</MDTypography>
                    {project && (
                        <MDBox mt={2}>
                            <MDTypography>
                                <strong>Name:</strong> {project.name}
                            </MDTypography>
                            <MDTypography>
                                <strong>Description:</strong> {project.description}
                            </MDTypography>
                            <MDTypography>
                                <strong>Users:</strong> {project.users?.map((u) => u.fullName).join(", ")}
                            </MDTypography>
                            <MDTypography>
                                <strong>Start:</strong> {project.startDate?.slice(0, 10)}
                            </MDTypography>
                            <MDTypography>
                                <strong>End:</strong> {project.endDate?.slice(0, 10)}
                            </MDTypography>
                            <MDTypography>
                                <strong>Total Hours Spent: </strong> {project.totalHourSpent}
                            </MDTypography>
                        </MDBox>
                    )}
                </Card>

                <Card sx={{ p: 3 }}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <MDTypography variant="h6">Tasks</MDTypography>
                        <MDButton
                            color="info"
                            onClick={() => {
                                setSelectedTaskId(null);
                                setOpenTaskModal(true);
                            }}
                        >
                            + Add Task
                        </MDButton>
                    </MDBox>
                    <DataTable
                        table={{ columns, rows: tasks }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                    />
                </Card>

                {/* Task Create/Edit Modal */}
                <TaskModal
                    open={openTaskModal}
                    onClose={() => {
                        setOpenTaskModal(false);
                        fetchTasks();
                    }}
                    projectId={projectId}
                    taskId={selectedTaskId}
                />

                {/* Task View Modal */}
                <ViewTaskModal
                    open={openViewModal}
                    onClose={() => setOpenViewModal(false)}
                    taskId={selectedTaskId}
                />

                {/* Timesheet Add Modal */}
                <AddTimesheetModal
                    open={openTimesheetModal}
                    onClose={() => {
                        setOpenTimesheetModal(false);
                        setSelectedTaskId(null);
                    }}
                    taskId={selectedTaskId}
                    projectId={projectId}
                    users={project?.users || []}
                />

                {/* ✅ View Logs Modal */}
                <ViewLogsModal
                    open={openLogsModal}
                    onClose={() => setOpenLogsModal(false)}
                    taskId={selectedTaskId}
                    projectId={projectId} // ✅ Fixed line
                />
            </MDBox>
        </DashboardLayout>
    );
}

export default ProjectDetails;
