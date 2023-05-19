import { FC, ReactElement, ChangeEvent } from "react";

// classnames
import cn from "classnames";

// lodash
import orderBy from "lodash/orderBy";

// mui components
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

// mui icons
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// components
import Dialogue from "../DialogueItem";

// styles
import styles from "./DialoguesList.module.scss";

// types
import { Status } from "../../../../models/Status";
import IUser from "../../../../models/IUser";
import IMessage from "../../../../models/IMessage";

export type IDialogueItem = {
  _id: string;
  lastMessage: IMessage;
  interlocutor: IUser | undefined;
  createdAt: string;
  updatedAt: string;
  unreadMessagesCount: number;
};

type DialoguesListProps = {
  status: Status;
  dialogues: IDialogueItem[];
  searchValue: string;
  handleChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
  // dialogue
  currentDialogueId: string;
};

const DialoguesList: FC<DialoguesListProps> = (props): ReactElement => {
  const {
    status,
    dialogues,
    searchValue,
    currentDialogueId,
    handleChangeValue,
  } = props;

  const loading = status === "loading" ? <CircularProgress /> : null;
  const empty =
    status === "success" && !dialogues.length ? (
      <Typography variant="h3">Ничего не найдено 😔</Typography>
    ) : null;
  const sortedDialogues =
    status === "success" && dialogues.length
      ? orderBy(dialogues, ["createdAt"], ["desc"]).map((dialogue) => (
          <Dialogue
            key={dialogue["_id"]}
            currentDialogueId={currentDialogueId}
            {...dialogue}
          />
        ))
      : null;

  return (
    <>
      <Box className={styles["dialogues__search"]}>
        <TextField
          fullWidth
          id="outlined-basic"
          placeholder="Поиск среди контактов"
          variant="outlined"
          value={searchValue}
          onChange={handleChangeValue}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& fieldset": {
              borderRadius: "15px",
            },
            "& ::placeholder": {
              fontSize: "15px",
            },
          }}
        />
      </Box>

      <ul
        className={cn(styles["dialogues__items"], {
          [styles["dialogues__items_empty"]]: !dialogues.length,
        })}
      >
        {loading}
        {empty}
        {sortedDialogues}
      </ul>
    </>
  );
};

export default DialoguesList;
