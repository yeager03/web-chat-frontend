import {
  Dispatch,
  FC,
  MouseEvent,
  ReactElement,
  SetStateAction,
  useState,
} from "react";

// components
import BaseMessage from "../components/Message";

// types
import IMessage, { IFile } from "../../../models/IMessage";
import { IMessageValue } from ".";

type MessageProps = IMessage & {
  isRead?: boolean;
  attachments?: any[];
  audio?: string;
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setUploadedFiles: Dispatch<SetStateAction<IFile[]>>;
  handleRemoveMessage: (id: string) => void;
  handleEditFiles: (files: IFile[]) => void;
};

const Message: FC<MessageProps> = (props): ReactElement => {
  const { setMessageValue, handleRemoveMessage, handleEditFiles } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLSpanElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <BaseMessage
      {...props}
      anchorEl={anchorEl}
      open={open}
      handleOpen={handleOpen}
      handleClose={handleClose}
      setMessageValue={setMessageValue}
      handleRemoveMessage={handleRemoveMessage}
      handleEditFiles={handleEditFiles}
    />
  );
};

export default Message;
