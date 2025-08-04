import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Card,
  Modal,
  Icon,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
} from "api/projectService";
import { getUsers } from "api/userService";

// Shared Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

function ActionCell({ row, onView, onEdit, onDelete }) {
  return (
    <MDBox display="flex" gap={1}>
      <Icon fontSize="small" color="info" style={{ cursor: "pointer" }} onClick={() => onView(row.original.id)}>
        visibility
      </Icon>
      <Icon fontSize="small" color="warning" style={{ cursor: "pointer" }} onClick={() => onEdit(row.original.id)}>
        edit
      </Icon>
      <Icon fontSize="small" color="error" style={{ cursor: "pointer" }} onClick={() => onDelete(row.original.id)}>
        delete
      </Icon>
    </MDBox>
  );
}

ActionCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function Projects() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    userIds: [],
  });


  const [formErrors, setFormErrors] = useState({});

  const columns = [
    { Header: "Project Name", accessor: "name" },
    { Header: "Description", accessor: "description" },
    { Header: "Start Date", accessor: "startDate" },
    { Header: "End Date", accessor: "endDate" },
    { Header: "Assigned Users", accessor: "assignedUsers" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <ActionCell row={row} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      ),
    },
  ];

  useEffect(() => {
    fetchProjects();
    fetchAllUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const projects = await getProjects();
      const formatted = projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        startDate: p.startDate?.slice(0, 10),
        endDate: p.endDate?.slice(0, 10),
        assignedUsers: p.users?.map((u) => u.fullName).join(", ") || "—",
        users: p.users,
      }));
      setRows(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await getUsers();
      setAllUsers(users);
    } catch (err) {
      console.error(err);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Project name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleOpenForm = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      userIds: [],
    });
    setOpenForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userId: formData.userIds, // API expects 'userId'
      };
      if (isEdit) {
        await updateProject(editProjectId, payload);
      } else {
        await addProject(payload);
      }
      setOpenForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  const handleView = (id) => {
    navigate(`/project/${id}`);
  };

  const handleEdit = async (id) => {
    try {
      const p = await getProjectById(id);
      setFormData({
        name: p.name,
        description: p.description,
        startDate: p.startDate?.slice(0, 10),
        endDate: p.endDate?.slice(0, 10),
        userIds: p.users?.map((u) => u.id) || [],
      });
      setEditProjectId(id);
      setIsEdit(true);
      setOpenForm(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              Projects
            </MDTypography>
            <Button
              onClick={handleOpenForm}
              variant="contained"
              sx={{ backgroundColor: "#fff", color: "#1A73E8", fontWeight: "bold" }}
            >
              Add Project
            </Button>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>

      {/* Add/Edit Modal */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <MDBox sx={modalStyle} component="form" onSubmit={handleFormSubmit}>
          <MDTypography variant="h5" mb={2}>
            {isEdit ? "Update Project" : "Create Project"}
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDInput
                label="Project Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange("name")}
              />
              {formErrors.name && <MDTypography color="error">{formErrors.name}</MDTypography>}
            </Grid>
            <Grid item xs={12}>
              <MDInput
                label="Description"
                name="description"
                fullWidth
                value={formData.description}
                onChange={handleInputChange("description")}
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="Start Date"
                name="startDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleInputChange("startDate")}
              />
            </Grid>
            <Grid item xs={6}>
              <MDInput
                label="End Date"
                name="endDate"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleInputChange("endDate")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="users-label">Assign Users</InputLabel>
                <Select
                  labelId="users-label"
                  multiple
                  value={formData.userIds}
                  onChange={handleInputChange("userIds")}
                  renderValue={(selected) =>
                    allUsers
                      .filter((u) => selected.includes(u.id))
                      .map((u) => u.fullName)
                      .join(", ")
                  }
                  sx={{
                    mt: 1,
                    lineHeight: "3.4375em",
                  }}
                >
                  {allUsers.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.fullName} ({u.empId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <MDBox mt={3} display="flex" justifyContent="flex-end">
            <MDButton type="submit" color="info">
              {isEdit ? "Update" : "Create"}
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>

      {/* View Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <MDBox sx={modalStyle}>
          <MDTypography variant="h5" mb={2}>
            Project Details
          </MDTypography>
          {selectedProject && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDTypography>
                  <strong>Name:</strong> {selectedProject.name}
                </MDTypography>
              </Grid>
              <Grid item xs={12}>
                <MDTypography>
                  <strong>Description:</strong> {selectedProject.description}
                </MDTypography>
              </Grid>
              <Grid item xs={12}>
                <MDTypography>
                  <strong>Users:</strong>{" "}
                  {selectedProject.users?.map((u) => u.fullName).join(", ") || "—"}
                </MDTypography>
              </Grid>
            </Grid>
          )}
        </MDBox>
      </Modal>
    </DashboardLayout>
  );
}

export default Projects;
