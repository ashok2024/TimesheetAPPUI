import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const SharedPagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  if (
    typeof totalCount !== "number" ||
    typeof pageSize !== "number" ||
    pageSize <= 0 ||
    totalCount < 0
  ) {
    return null;
  }

  const pageCount = Math.ceil(totalCount / pageSize);
  if (pageCount <= 1) return null;

  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(startEntry + pageSize - 1, totalCount);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      flexWrap="wrap"
      px={2}
    >
      {/* Left Side: Entry Info */}
      <Typography variant="body2" color="textSecondary">
        Showing {startEntry}–{endEntry} of {totalCount} entries
      </Typography>

      {/* Right Side: Pagination */}
      <Stack spacing={2} direction="row" alignItems="center">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, page) => onPageChange(page)}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default SharedPagination;
