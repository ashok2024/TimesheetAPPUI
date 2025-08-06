import axiosInstance from "../utils/axiosInstance";

// GET: /api/Dashboard/hours-per-project
export const getHoursPerProject = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/Dashboard/hours-per-project", {
      params, // optional filters like { limit: 7 } or { fromDate, toDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hours per project:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};


// GET: /api/Dashboard/task-trends
export const getTaskTrends = async () => {
  try {
    const response = await axiosInstance.get("/Dashboard/task-trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching task trends:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};

// GET: /api/Dashboard/weekly-summary
export const getWeeklySummary = async () => {
  try {
    const response = await axiosInstance.get("/Dashboard/weekly-summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};

// POST: /api/Timesheets/filter
export const filterTimesheets = async (filterData) => {
  try {
    const response = await axiosInstance.post("/Timesheets/filter", filterData);
    return response.data;
  } catch (error) {
    console.error("Error filtering timesheets:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    return [];
  }
};

// GET: /api/Timesheets/export
export const exportTimesheets = async () => {
  try {
    const response = await axiosInstance.get("/Timesheets/export", {
      responseType: "blob", // important for file download
    });
    return response;
  } catch (error) {
    console.error("Error exporting timesheets:", error);
    if (error.response?.status === 401) {
      window.location.href = "/authentication/sign-in";
    }
    throw error;
  }
};
