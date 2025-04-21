// Enum for user roles in the system
export const UserRoleEnum = {
  ADMIN: "admin", // Super admin with full privileges
  PROJECT_ADMIN: "project_admin", // Admin for a specific project
  MEMBER: "member", // Regular team member
};

// Exported array of user roles for easy validation or dropdowns
export const AvailableUserRoles = Object.values(UserRoleEnum);

// Enum for task statuses in a project/task management flow
export const TaskStatusEnum = {
  TODO: "todo", // Task is yet to be started
  IN_PROGRESS: "in_progress", // Task is currently being worked on
  DONE: "done", // Task has been completed
};

// Exported array of task statuses for validation or UI components
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);
