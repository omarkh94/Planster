import { FieldError } from "react-hook-form";

export interface BaseEntity {
  id?: string;
  _id?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Member {
  user: UserType;
  role: Role;
}
export interface TeamType extends BaseEntity {
  name: string;
  description: string;
  members: Array<UserType>;
}
export interface project {
  project: ProjectType;
  role: Role;
}
export interface UserType extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  projects: project;
  password: string;
  team: TeamType;
  jobTitle:
    | "Frontend Developer"
    | "Backend Developer"
    | "Full Stack Developer"
    | "Software Engineer"
    | "UI/UX Developer"
    | "Web Developer"
    | "Mobile App Developer"
    | "DevOps Engineer"
    | "Cloud Engineer"
    | "API Developer";
}
export interface Role extends BaseEntity {
  role: "admin" | "supervisor" | "member";
  permissions: Array<string>;
}

export interface CommentType extends BaseEntity {
  description: string;
  commenter: UserType;
}
export interface TicketType extends BaseEntity {
  title: string;
  description: string;
  status: WorkFlowListType;
  author: UserType;
  assignee: UserType;
  expectedDeadLine: Date;
  comments: Array<CommentType>;
  updatedBy: UserType;
}

export interface WorkFlowListType extends BaseEntity {
  title:
    | ""
    | "Backlog"
    | "To Do"
    | "In Progress"
    | "Blocked"
    | "Code Review"
    | "Ready for QA"
    | "QA In Progress"
    | "Approved"
    | "Done"
    | "Deployed";
  author: UserType;
  list: Array<TicketType>;
  updatedBy: UserType;
}

export interface ProjectType extends BaseEntity {
  _id: string;
  title: string;
  description: string;
  teams: Array<TeamType>;
  projectOwner: UserType;
  expectedDeadLine: Date;
  members: Array<Member>;
  list: Array<WorkFlowListType>;
  role?: Role;
  project?: project;
}

export interface MessageType extends BaseEntity {
  content: string;
  sender: UserType;
  chatRoomId: ProjectType;
  timestamp: Date;
  seenBy: UserType;
  teamId: string;
  mentions: UserType[];
  replies: ReplyType[];
  deliveredTo: UserType[];
  notifiedUsers: UserType[];
}

export interface ChatRoomType {
  chatRoomId: MessageType.chatRoomId;
  messages: Array<MessageType>;
  users: Array<UserType>;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
  userId: string;
}

export interface ReceiveMessagePayload {
  roomId: string;
  messages: Array<MessageType>;
}

export interface ChatState {
  messages: Array<MessageType>;
  users: Array<UserType>;
}

export type ColumnProps = BaseEntity & {
  title: string;
  author?: UserType;
  tickets: TicketType[];
  updatedBy?: UserType;
};

// export type Card = {
//   id: string;
//   title: string;
// };
export interface FormItemProps {
  name: string;
  label?: string;
  type?:
    | "text"
    | "password"
    | "email"
    | "checkbox"
    | "select"
    | "textarea"
    | "radio";
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  error?: FieldError;
  showPasswordButton?: boolean;
  required?: boolean;
  rows?: number;
  termsAndConditions?: ReactNode;
  value?: string;
  withForgetPasswordLink?: boolean;
  onForgetPasswordClick?: () => void;
  disabled?: boolean;
}

export interface Country {
  code: string;
  dialCode: string;
  name: string;
}
