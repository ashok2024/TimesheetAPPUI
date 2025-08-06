import axiosInstance from "../utils/axiosInstance";

// GET: /api/Task
export const getTasks = async () => {
    try {
        const response = await axiosInstance.get("/Task");
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response?.status === 401) {
            window.location.href = "/authentication/sign-in";
        }
        return [];
    }
};
export const getPaginatedTasksByProjectId = async (projectId, page = 1, pageSize = 10) => {
    try {
        const response = await axiosInstance.get(`/Task/project/${projectId}/paginated?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated tasks:", error);
        if (error.response?.status === 401) {
            window.location.href = "/authentication/sign-in";
        }
        return { data: [], totalCount: 0 };
    }
};
// GET: /api/Task/{id}
export const getTaskById = async (id) => {
    try {
        const response = await axiosInstance.get(`/Task/${id}`);
        debugger;
        return response.data;
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        throw error;
    }
};

// POST: /api/Task
export const addTask = async (taskData) => {
    const headers = taskData instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const response = await axiosInstance.post("/Task", taskData, { headers });
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const headers = taskData instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    const response = await axiosInstance.put(`/Task/${id}`, taskData, { headers });
    return response.data;
};

// DELETE: /api/Task/{id}
export const deleteTask = async (id) => {
    try {
        const response = await axiosInstance.delete(`/Task/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting task:", error);
        if (error.response?.status === 401) {
            window.location.href = "/authentication/sign-in";
        }
        throw error;
    }
};

export const getTasksByProjectId = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/Task/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks by project ID:", error);
        if (error.response?.status === 401) {
            window.location.href = "/authentication/sign-in";
        }
        return [];
    }
};
