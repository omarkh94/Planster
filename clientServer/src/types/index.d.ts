export interface BaseEntity {
  id: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserType extends BaseEntity {
  name: string;
  lastName: string;
  email: string;
  password: string;
  jobTitle: string;
  gender: "male" | "female";
  phoneNumber: number;
}
export interface TeamRole extends BaseEntity {
  role: "admin" | "supervisor" | "member";
  permissions: Array<string>;
}
export interface TeamMember {
  user: UserType;
  role: TeamRole;
}
export interface TeamType extends BaseEntity {
  name: string;
  members: Array<TeamMember>;
  roomId: ChatRoomType;
}

export interface CommentType extends BaseEntity {
  description: string;
  commenter: UserType;
}
export interface CardType extends BaseEntity {
  title: string;
  description: string;
  author: UserType;
  assignee: UserType;
  comments: Array<CommentType>;
}

export interface CardListType extends BaseEntity {
  title: string;
  author: UserType;
  list: Array<CardType>;
  updatedBy: UserType;
}

export interface ProjectType extends BaseEntity {
  title: string;
  description: string;
  expectedDeadLine: Date;
  team: TeamType;
  projectOwner: UserType;
  list: Array<CardListType>;
  updatedBy?: UserType;
}

export interface MessageType extends BaseEntity {
  content: string;
  sender: UserType;
  timestamp: Date;
  teamId: string;
  mentions: UserType[];
  replies: ReplyType[];
}

export interface ChatRoomType {
  roomId: string;
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
  list: CardType[];
  updatedBy?: UserType;
};

export type Card = {
  id: string;
  title: string;
};
