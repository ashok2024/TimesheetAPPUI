// menuConfig.js

import Icon from "@mui/material/Icon";

export const menusByRole = {
  Admin: [
    {
      name: "Dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      path: "/dashboard",
    },
    {
      name: "Users",
      icon: <Icon fontSize="small">table_view</Icon>,
      path: "/users",
    },
    {
      name: "Project",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      path: "/project",
    },
    {
      name: "TimeSheet",
      icon: <Icon fontSize="small">access_time</Icon>,
      path: "/timesheet",
    },
  ],
  manager: [
    {
      name: "Dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      path: "/dashboard",
    },
    {
      name: "Project",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      path: "/project",
    },
  ],
  User: [
    {
      name: "Dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      path: "/dashboard",
    },
    {
      name: "TimeSheet",
      icon: <Icon fontSize="small">access_time</Icon>,
      path: "/timesheet",
    },
  ],
};
