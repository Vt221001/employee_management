import { FaHome, FaUsers, FaUser, FaRegCircle } from "react-icons/fa";
import { RiCustomerService2Fill, RiBuilding2Fill } from "react-icons/ri";
import { MdOutlineAddTask } from "react-icons/md";

const navigation = [
  {
    name: "Dashboard",
    to: "/management/dashboard",
    icon: FaHome,
    current: true,
    roles: ["Admin", "ProjectManager", "Client"],
  },
  {
    name: "Teams",
    to: "#",
    icon: FaUsers,
    current: false,
    roles: ["Admin", "ProjectManager"],
    children: [
      {
        name: "Add Members",
        to: "/management/add-team",
        roles: ["Admin"],
        icon: FaRegCircle,
      },
      {
        name: "View Members",
        to: "/management/view-team",
        roles: ["Admin"],
        icon: FaRegCircle,
      },
    ],
  },

  {
    name: "Projects",
    to: "#",
    icon: RiBuilding2Fill,
    roles: ["Admin", "ProjectManager"],
    children: [
      {
        name: "Add Project",
        to: "/management/add-projects",
        roles: ["Admin"],
        icon: FaRegCircle,
      },
      {
        name: "All Projects",
        to: "/management/view-projects",
        roles: ["Admin"],
        icon: FaRegCircle,
      },
      {
        name: "Assign Project",
        to: "/management/assign-projects",
        roles: ["Admin"],
        icon: FaRegCircle,
      },
    ],
  },
  {
    name: "Task",
    to: "#",
    icon: MdOutlineAddTask,
    roles: ["Admin", "TeamMember"],
    children: [
      {
        name: "Assign Task",
        to: "/management/assign-task",
        roles: ["Admin", "ProjectManager"],
        icon: FaRegCircle,
      },
      {
        name: "View Task",
        to: "/management/view-tasks",
        roles: ["Admin", "ProjectManager", "TeamMember"],
        icon: FaRegCircle,
      },
    ],
  },
];

export default navigation;
