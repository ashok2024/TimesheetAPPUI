import axiosInstance from "../utils/axiosInstance";

// GET: /api/timesheet?projectId=&taskId=&userId=
export const getTimeLogsByFilter = async ({ projectId, taskId, userId }) => {
  const queryParams = new URLSearchParams();
  if (projectId) queryParams.append("projectId", projectId);
  if (taskId) queryParams.append("taskId", taskId);
  if (userId) queryParams.append("userId", userId);

  try {
    const res = await axiosInstance.get(`/timesheet?${queryParams.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching time logs by filter:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};

// GET: /api/timesheet/{id}
export const getTimeLogById = async (id) => {
  try {
    const res = await axiosInstance.get(`/timesheet/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching time log by ID:", error);
    throw error;
  }
};

// POST: /api/timesheet
export const addTimeLog = async (log) => {
  try {
    const res = await axiosInstance.post(`/timesheet`, log);
    return res.data;
  } catch (error) {
    console.error("Error adding time log:", error);
    throw error;
  }
};

// PUT: /api/timesheet/{id}
export const updateTimeLog = async (id, log) => {
  try {
    const res = await axiosInstance.put(`/timesheet/${id}`, log);
    return res.data;
  } catch (error) {
    console.error("Error updating time log:", error);
    throw error;
  }
};

// DELETE: /api/timesheet/{id}
export const deleteTimeLog = async (id) => {
  try {
    const res = await axiosInstance.delete(`/timesheet/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting time log:", error);
    throw error;
  }
};

export const getTimeLogsByTaskAndUser = async (taskId, userId) => {
  try {
    if (!taskId) throw new Error("taskId is undefined or null");

    const queryParams = new URLSearchParams();
    queryParams.append("taskId", taskId);
    if (userId) queryParams.append("userId", userId); // optional if needed

    const url = `/timesheet/by-task-user?${queryParams.toString()}`;
    console.log("Calling:", url);

    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching time logs by task and user:", error);
    throw error;
  }
};
