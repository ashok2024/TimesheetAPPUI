import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SharedPagination from "../../components/Shared/SharedPagination";
import { getUsers, getUserById, addUser, updateUser, deleteUser, getUsersPaginated } from "api/userService";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
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
      <Icon
        fontSize="small"
        color="info"
        style={{ cursor: "pointer" }}
        titleAccess="View"
        onClick={() => onView(row.original.id)}
      >
        visibility
      </Icon>
      <Icon
        fontSize="small"
        color="warning"
        style={{ cursor: "pointer" }}
        titleAccess="Edit"
        onClick={() => onEdit(row.original.id)}
      >
        edit
      </Icon>
      <Icon
        fontSize="small"
        color="error"
        style={{ cursor: "pointer" }}
        titleAccess="Delete"
        onClick={() => onDelete(row.original.id)}
      >
        delete
      </Icon>
    </MDBox>
  );
}

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function Tables() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [formData, setFormData] = useState({
    fullName: "",
    empId: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "",
    dateOfJoining: "",
    password: "Test@123",
  });

  const [formErrors, setFormErrors] = useState({});

  const columns = [
    { Header: "Name", accessor: "fullName" },
    { Header: "EmpId", accessor: "empId" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phoneNumber" },
    { Header: "Department", accessor: "department" },
    { Header: "Role", accessor: "role" },
    { Header: "Joining Date", accessor: "dateOfJoining" },
    { Header: "Status", accessor: "isActive" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <ActionCell row={row} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    const { data, totalCount } = await getUsersPaginated(page, pageSize); // use paginated API
    setRows(data);
    setTotalCount(totalCount);
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = "Full Name is required";
    if (!formData.empId) errors.empId = "Emp ID is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone must be digits only";
    }
    if (!formData.department) errors.department = "Department is required";
    if (!formData.role) errors.role = "Role is required";
    if (!formData.dateOfJoining) errors.dateOfJoining = "Joining date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleOpen = () => {
    setIsEdit(false);
    setFormData({
      fullName: "",
      empId: "",
      email: "",
      phoneNumber: "",
      department: "",
      role: "",
      dateOfJoining: "",
      password: "@mishra.123",
    });
    setOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await updateUser(editUserId, formData);
      } else {
        await addUser(formData);
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save user.");
    }
  };

  const handleView = async (id) => {
    try {
      const user = await getUserById(id);
      setSelectedUser(user);
      setViewOpen(true);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch user.");
    }
  };

  const handleEdit = async (id) => {
    try {
      const user = await getUserById(id);
      setFormData({
        fullName: user.fullName || "",
        empId: user.empId || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        department: user.department || "",
        role: user.role || "",
        dateOfJoining: user.dateOfJoining?.substring(0, 10) || "",
        password: "Test@123",
      });
      setEditUserId(id);
      setIsEdit(true);
      setOpen(true);
    } catch (err) {
      console.error("Edit fetch error:", err);
      alert("Error loading user.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteUser(id);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user. Please try again.");
    }
  };
  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
    setFormData({
      fullName: "",
      empId: "",
      email: "",
      phoneNumber: "",
      department: "",
      dateOfJoining: "",
      role: "",
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                  Users
                </MDTypography>
                <Button
                  onClick={handleOpen}
                  variant="contained"
                  sx={{ backgroundColor: "#fff", color: "#1A73E8", fontWeight: "bold" }}
                >
                  Add User
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <MDBox mt={1} mx={1}>
                <hr style={{ borderTop: "1px solid #e0e0e0" }} />
              </MDBox>
              <MDBox px={1} py={1}>
                <SharedPagination
                  totalCount={totalCount}
                  pageSize={pageSize}
                  currentPage={page}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Create / Update Modal */}
      <Modal open={open} onClose={handleClose}>
        <MDBox sx={modalStyle} component="form" onSubmit={handleFormSubmit} position="relative">
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <MDTypography variant="h5" mb={2}>
            {isEdit ? "Update User" : "Create New User"}
          </MDTypography>

          <Grid container spacing={2}>
            {["fullName", "empId", "email", "phoneNumber", "department", "dateOfJoining"].map((field) => (
              <Grid item xs={12} key={field}>
                <MDInput
                  fullWidth
                  type={field === "email" ? "email" : field === "dateOfJoining" ? "date" : "text"}
                  label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  error={!!formErrors[field]}
                />
                {formErrors[field] && (
                  <MDTypography variant="caption" color="error">
                    {formErrors[field]}
                  </MDTypography>
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <MDTypography variant="caption" fontWeight="medium" mb={1}>
                Role
              </MDTypography>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: formErrors.role ? "1px solid red" : "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              {formErrors.role && (
                <MDTypography variant="caption" color="error">
                  {formErrors.role}
                </MDTypography>
              )}
            </Grid>
          </Grid>

          <MDBox mt={3} display="flex" justifyContent="flex-end">
            <MDButton type="submit" color="info">
              {isEdit ? "Update User" : "Save User"}
            </MDButton>
          </MDBox>
        </MDBox>
      </Modal>
      {/* View Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)}>
        <MDBox sx={modalStyle}>
          <MDTypography variant="h5" mb={2}>
            User Details
          </MDTypography>
          {selectedUser ? (
            <Grid container spacing={2}>
              {["fullName", "empId", "email", "phoneNumber", "department", "role", "dateOfJoining"].map((field) => (
                <Grid item xs={12} key={field}>
                  <MDTypography variant="body2">
                    <strong>{field.replace(/([A-Z])/g, " $1")}:</strong> {selectedUser[field]}
                  </MDTypography>
                </Grid>
              ))}
            </Grid>
          ) : (
            <MDTypography>Loading...</MDTypography>
          )}
        </MDBox>
      </Modal>
    </DashboardLayout>
  );
}

export default Tables;
