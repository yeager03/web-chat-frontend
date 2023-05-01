// types
import IDialogue from "./IDialogue";
import IUser from "./IUser";

export interface IFile {
  _id: string;
  fileName: string;
  url: string;
  size: number;
  extension: string;
}

export default interface IMessage {
  _id: string;
  author: IUser;
  message: string;
  dialogue: IDialogue;
  isRead: boolean;
  isEdited: boolean;
  isReference: boolean;
  createdAt: string;
  updatedAt: string;
  files: IFile[];
}
