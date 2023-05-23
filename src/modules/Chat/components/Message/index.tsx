import { FC, ReactElement, MouseEvent, Dispatch, SetStateAction } from "react";

// mui components
import { Popover, Box } from "@mui/material";

// mui icons
import { DeleteRounded, EditRounded } from "@mui/icons-material";

// components
import UserAvatar from "../../../../components/UserAvatar";
import IconRead from "../../../../components/IconRead";
import AudioMessage from "../AudioMessage";

// classnames
import cn from "classnames";

// date
import getMessageDate from "../../../../utils/messageDate";

// style
import styles from "./Message.module.scss";

// hooks
import useAuth from "../../../../hooks/useAuth";

// photoswipe
import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";

// types
import IMessage, { IFile } from "../../../../models/IMessage";
import { IMessageValue } from "../../containers";

type MessageProps = IMessage & {
  isRead?: boolean;
  attachments?: any[];
  audio?: string;
  anchorEl: HTMLSpanElement | null;
  open: boolean;
  messageValue: IMessageValue;
  handleOpen: (e: MouseEvent<HTMLSpanElement>) => void;
  handleClose: () => void;
  setMessageValue: Dispatch<SetStateAction<IMessageValue>>;
  setUploadedFiles: Dispatch<SetStateAction<IFile[]>>;
  handleRemoveMessage: (id: string) => void;
  handleEditFiles: (files: IFile[]) => void;
};

const Message: FC<MessageProps> = (props): ReactElement => {
  const {
    _id,
    author,
    message,
    createdAt,
    isRead,
    isEdited,
    isReference,
    files,
    anchorEl,
    open,
    messageValue,
    setMessageValue,
    setUploadedFiles,
    handleOpen,
    handleClose,
    handleRemoveMessage,
    handleEditFiles,
  } = props;
  const { user } = useAuth();
  const isMyMessage = user?._id === author._id;

  const audioFiles = files.filter((file) => file.type === "audio");
  const imageFiles = files.filter((file) => file.type === "image");

  return (
    <Box
      className={cn(styles["message"], {
        [styles["message_my-message"]]: isMyMessage,
        [styles["message_image"]]: files.length <= 5 && !message,
      })}
    >
      <Box className={styles["message__avatar"]}>
        <UserAvatar user={author} />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box className={styles["message__popover"]}>
          <EditRounded
            className={styles["popover__icon"]}
            onClick={() => {
              setMessageValue({ value: message, type: "edit", id: _id });
              if (files.length) {
                handleEditFiles(files);
                setUploadedFiles(files);
              }
              handleClose();
            }}
          />
          <DeleteRounded
            className={styles["popover__icon"]}
            onClick={() => {
              handleRemoveMessage(_id);
              handleClose();
            }}
          />
        </Box>
      </Popover>

      <Box className={styles["message__content"]}>
        {message && (
          <Box className={styles["message__bubble"]}>
            {message && !isReference ? (
              <p className={styles["message__text"]}>
                {isEdited ? (
                  <>
                    {message}
                    <b>(ред.)</b>
                  </>
                ) : (
                  message
                )}
              </p>
            ) : (
              <a
                className={styles["message__link"]}
                href={
                  !message.match(/^[a-zA-Z]+:\/\//)
                    ? `http://${message}`
                    : message
                }
                target="_blank"
                rel="noreferrer"
              >
                {isEdited ? (
                  <>
                    {message}
                    <b>(ред.)</b>
                  </>
                ) : (
                  message
                )}
              </a>
            )}
          </Box>
        )}

        {imageFiles.length ? (
          <Box className={styles["message__attachments"]}>
            <ul className={styles["attachments-items"]}>
              {imageFiles.map((file) => {
                return (
                  <li className={styles["attachment-item"]} key={file["_id"]}>
                    <SlideshowLightbox>
                      <img
                        src={file["url"]}
                        alt={file["fileName"]}
                        className={styles["attachment-item__image"]}
                      />
                    </SlideshowLightbox>
                  </li>
                );
              })}
            </ul>
          </Box>
        ) : null}

        {audioFiles.length ? (
          <Box className={styles["message-audio-files"]}>
            {audioFiles.map((file) => {
              return (
                <Box className={styles["message__audio"]} key={file._id}>
                  <AudioMessage
                    _id={file._id}
                    title={file.fileName}
                    src={file.url}
                  />
                </Box>
              );
            })}
          </Box>
        ) : null}

        {createdAt && (
          <div
            className={styles["message__date"]}
            onClick={(e) => {
              if (!isMyMessage || messageValue.type === "edit") {
                return;
              }
              handleOpen(e);
            }}
          >
            <span>{getMessageDate(createdAt)}</span>
            {isEdited && !message && <b>(ред.)</b>}
          </div>
        )}

        <IconRead
          className={styles["message__checked-icon"]}
          isMyMessage={isMyMessage}
          isRead={isRead}
        />
      </Box>
    </Box>
  );
};

export default Message;
