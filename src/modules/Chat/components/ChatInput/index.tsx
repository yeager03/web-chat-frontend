import {
  ChangeEvent,
  FC,
  ReactElement,
  KeyboardEvent,
  RefObject,
  ClipboardEvent,
} from "react";

// mui components
import { Box } from "@mui/material";

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
} from "@mui/icons-material";

// types
import { IMessageValue } from "../../containers";
import { IFile } from "../../../../models/IMessage";

type ChatInputProps = {
  messageValue: IMessageValue;
  triggerRef: RefObject<SVGSVGElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  inputRef: RefObject<HTMLDivElement>;
  chatInputRef: RefObject<HTMLDivElement>;
  images: IFile[];
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFilePick: () => void;
  handleRemoveImage: (key: string) => void;
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
    fileInputRef,
    inputRef,
    chatInputRef,
    images,
    handleChangeImage,
    handleFilePick,
    handleRemoveImage,
    handleChangeSearchValue,
    handleKeyDown,
    handleOnPaste,
    sendMessage,
    editMessage,
    removeMessage,
  } = props;
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
            ref={fileInputRef}
            onChange={handleChangeImage}
            onClick={(event) => ((event.target as HTMLInputElement).value = "")}
          />

          <CameraAltRounded
            className={cn(
              styles["input-wrapper__icon"],
              styles["input-wrapper__camera"]
            )}
            onClick={handleFilePick}
          />

          {messageValue.type === "create" ? (
            messageValue.value.trim().length || images.length ? (
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
          ) : messageValue.value.trim().length || images.length ? (
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

      {images.length > 0 && (
        <ul className={styles["input-images"]}>
          {images.map((image, index) => {
            return (
              <li key={image.url}>
                <span onClick={() => handleRemoveImage(image._id)}>
                  <CloseRounded sx={{ color: "#fff", fontSize: 20 }} />
                </span>
                <img src={image.url} alt={`Uploaded ${index + 1} file`} />
              </li>
            );
          })}
        </ul>
      )}
    </Box>
  );
};

export default ChatInput;
