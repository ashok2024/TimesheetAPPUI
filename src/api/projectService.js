import axiosInstance from "../utils/axiosInstance";

//  GET: /api/Projects
export const getProjects = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`/Projects/paginated?page=${page}&pageSize=${pageSize}`);
    const { data, total } = response.data;
    return { data, totalCount: total };
  } catch (error) {
    console.error("Error fetching paginated projects:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return { data: [], totalCount: 0 };
  }
};

//  GET: /api/Projects/{id}
export const getProjectById = async (id) => {
  try {
    const response = await axiosInstance.get(`/Projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

// POST: /api/Projects
export const addProject = async (projectData) => {
  try {
    const response = await axiosInstance.post("/Projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Error adding project:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error;
  }
};

// PUT: /api/Projects/{id}
export const updateProject = async (id, projectData) => {
  try {
    const response = await axiosInstance.put(`/Projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error;
  }
};

//  DELETE: /api/Projects/{id}
export const deleteProject = async (id) => {
  try {
    const response = await axiosInstance.delete(`/Projects/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error;
  }
};
