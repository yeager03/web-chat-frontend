import {
  FC,
  ReactElement,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  ClipboardEvent,
  useState,
} from "react";

// mui components
import { Box, Popover } from "@mui/material";

// style
import styles from "./ChatInput.module.scss";

// classnames
import cn from "classnames";

// mui icons
import {
  SentimentSatisfiedAltRounded,
  MicRounded,
  CameraAltRounded,
  SendRounded,
  CheckCircleRounded,
  DeleteRounded,
  CloseRounded,
  AttachFileRounded,
  AudioFileRounded,
} from "@mui/icons-material";

// types
import { IMessageValue } from "../../containers";
import { IFile } from "../../../../models/IMessage";

type ChatInputProps = {
  messageValue: IMessageValue;
  triggerRef: RefObject<SVGSVGElement>;
  imageInputRef: RefObject<HTMLInputElement>;
  audioInputRef: RefObject<HTMLInputElement>;
  inputRef: RefObject<HTMLDivElement>;
  chatInputRef: RefObject<HTMLDivElement>;
  uploadedFiles: IFile[];
  handleFilePick: (e: MouseEvent<SVGSVGElement>) => void;
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (id: string) => void;
  handleChangeSearchValue: (e: ChangeEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  handleOnPaste: (e: ClipboardEvent<HTMLDivElement>) => void;
  sendMessage: () => void;
  editMessage: () => void;
  removeMessage: () => void;
};

const ChatInput: FC<ChatInputProps> = (props): ReactElement => {
  const {
    messageValue,
    triggerRef,
    imageInputRef,
    audioInputRef,
    inputRef,
    chatInputRef,
    uploadedFiles,
    handleChangeImage,
    handleFilePick,
    handleRemoveFile,
    handleChangeSearchValue,
    handleKeyDown,
    handleOnPaste,
    sendMessage,
    editMessage,
    removeMessage,
  } = props;

  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box className={styles["chat-input"]} ref={chatInputRef}>
      <Box className={styles["input-wrapper"]}>
        <SentimentSatisfiedAltRounded
          className={cn(
            styles["input-wrapper__icon"],
            styles["input-wrapper__smile"]
          )}
          ref={triggerRef}
        />
        <Box
          contentEditable="true"
          className={styles["input"]}
          onInput={handleChangeSearchValue}
          onPaste={handleOnPaste}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        ></Box>
        <Box className={styles["input-wrapper__actions"]}>
          <input
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.gif,.web"
            multiple
            className="input_hidden"
            hidden
            ref={imageInputRef}
            onChange={handleChangeImage}
            onClick={(event) => ((event.target as HTMLInputElement).value = "")}
          />
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.wma,.aac,.flac,.ogg,.m4a,.aiff,.alac,.amr,.ape,.au,.mpc,.tta,.wv,.opus"
            multiple
            className="input_hidden"
            hidden
            ref={audioInputRef}
            onChange={handleChangeImage}
            onClick={(event) => ((event.target as HTMLInputElement).value = "")}
          />
          <AttachFileRounded
            className={cn(
              styles["input-wrapper__icon"],
              styles["input-wrapper__attach"]
            )}
            onClick={handleClick}
          />

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
            sx={{
              ["& div"]: {
                padding: "10px",
                display: "flex",
                flexDirection: "column-reverse",
              },
            }}
          >
            <CameraAltRounded
              className={styles["input-wrapper__icon"]}
              file-type="image"
              onClick={(e) => {
                handleFilePick(e);
                handleClose();
              }}
            />
            <AudioFileRounded
              className={styles["input-wrapper__icon"]}
              sx={{
                marginBottom: "10px",
              }}
              file-type="audio"
              onClick={(e) => {
                handleFilePick(e);
                handleClose();
              }}
            />
          </Popover>

          {messageValue.type === "create" ? (
            messageValue.value.trim().length || uploadedFiles.length ? (
              <SendRounded
                className={cn(
                  styles["input-wrapper__icon"],
                  styles["input-wrapper__send"]
                )}
                onClick={sendMessage}
              />
            ) : (
              <MicRounded
                className={cn(
                  styles["input-wrapper__icon"],
                  styles["input-wrapper__audio"]
                )}
              />
            )
          ) : messageValue.value.trim().length || uploadedFiles.length ? (
            <CheckCircleRounded
              className={cn(
                styles["input-wrapper__icon"],
                styles["input-wrapper__send"]
              )}
              onClick={editMessage}
            />
          ) : (
            <DeleteRounded
              className={cn(
                styles["input-wrapper__icon"],
                styles["input-wrapper__audio"]
              )}
              onClick={removeMessage}
            />
          )}
        </Box>
      </Box>

      {uploadedFiles.length > 0 && (
        <ul className={styles["input-images"]}>
          {uploadedFiles.map((file, index) => {
            return (
              <li key={file.url}>
                <span onClick={() => handleRemoveFile(file._id)}>
                  <CloseRounded sx={{ color: "#fff", fontSize: 20 }} />
                </span>
                <img src={file.url} alt={`Uploaded ${index + 1} file`} />
              </li>
            );
          })}
        </ul>
      )}
    </Box>
  );
};

export default ChatInput;
