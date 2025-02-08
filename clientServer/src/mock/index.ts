import {
  ChatRoomType,
  Country,
  MessageType,
  ProjectType,
  TeamType,
  UserType,
} from "@/types";

export const mockUsers: UserType[] = [
  {
    id: "67a35b4d278aa17859d83045",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    formattedPhoneNumber: "+7-1234567890",
    projects: {
      project: {
        id: "101",
        title: "Project Alpha",
        description: "First project",
        teams: [],
        projectOwner: {} as UserType,
        expectedDeadLine: new Date(),
        members: [],
        list: [],
      },
      role: {
        id: "301",
        role: "admin",
        permissions: ["manage_users", "edit_projects"],
      },
    },
    password: "securepassword",
    team: {} as TeamType,
    jobTitle: "Back-end dev",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    formattedPhoneNumber: "9876543210",
    projects: {
      project: {
        id: "102",
        title: "Project Beta",
        description: "Second project",
        teams: [],
        projectOwner: {} as UserType,
        expectedDeadLine: new Date(),
        members: [],
        list: [],
      },
      role: {
        id: "302",
        role: "supervisor",
        permissions: ["view_reports", "manage_team"],
      },
    },
    password: "anotherpassword",
    team: {} as TeamType,
    jobTitle: "Back-end dev",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const projects: ProjectType[] = [
  {
    id: "101",
    title: "Project Alpha",
    description: "A sample project description",
    teams: [],
    projectOwner: mockUsers[0],
    expectedDeadLine: new Date(),
    members: [
      {
        user: mockUsers[0],
        role: {
          id: "301",
          role: "admin",
          permissions: ["manage_users", "edit_projects"],
        },
      },
    ],
    list: [],
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockMessages: MessageType[] = [
  {
    id: "501",
    content: "Hello, team!",
    sender: mockUsers[0],
    chatRoomId: projects[0],
    timestamp: new Date(),
    seenBy: mockUsers[1],
    teamId: "201",
    mentions: [mockUsers[1]],
    replies: [],
    deliveredTo: [mockUsers[1]],
    notifiedUsers: [mockUsers[1]],
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockChatRooms: ChatRoomType[] = [
  {
    chatRoomId: projects[0],
    messages: mockMessages,
    users: mockUsers,
  },
];

export const countries: Country[] = [
  { code: "US", dialCode: "+1", name: "United States" },
  { code: "JO", dialCode: "+962", name: "Jordan" },
  { code: "CA", dialCode: "+4", name: "Canada" },
  { code: "GB", dialCode: "+44", name: "United Kingdom" },
  { code: "IN", dialCode: "+91", name: "India" },
];

export const mockData = {
  users: mockUsers,
  Roles: [],
  teams: [],
  comments: [],
  Tickets: [],
  workFlowLists: [],
  projects,
  messages: mockMessages,
};
