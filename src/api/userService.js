import axiosInstance from "../utils/axiosInstance";

export const getUsers = async () => {
  try {
    debugger;
    const response = await axiosInstance.get("/User/GetAllUsers");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};
export const getUsersPaginated = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`/User/paginated?page=${page}&pageSize=${pageSize}`);
    const { data, total } = response.data;
    return { data, totalCount: total };
  } catch (error) {
    console.error("Error fetching paginated users:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return { data: [], totalCount: 0 };
  }
};
export const addUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/User/AddUser", userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error; // Optional: rethrow for further handling
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/User/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/User/${id}`, userData); 
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/User/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error;
  }
};

export const exportUsersToCsv = async () => {
  try {
    const response = await axiosInstance.get("/User/ExportCsv", {
      responseType: "blob", // Important to handle file download
    });
    return response;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw error;
  }
};
export const getUsersByProjectId = async (projectId) => {
  try {
    const response = await axiosInstance.get(`/User/by-project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users by project ID:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};

