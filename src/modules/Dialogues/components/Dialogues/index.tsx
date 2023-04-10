import { FC, ReactElement } from "react";

// containers
import DialoguesList from "../../containers/DialoguesList";

// mui components
import { Typography, Box } from "@mui/material";

// modules
import Chat from "../../../Chat";

// icons
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";

// style
import styles from "./Dialogues.module.scss";

const Dialogues: FC = (): ReactElement => {
	return (
		<>
			<Box className={styles["dialogues"]}>
				<Box className={styles["dialogues__header"]}>
					<QuestionAnswerRoundedIcon sx={{ fontSize: 22 }} />
					<Typography variant="h2">Список диалогов</Typography>
				</Box>

				<Box className={styles["dialogues__list"]}>
					<DialoguesList />
				</Box>
			</Box>

			<Chat />
		</>
	);
};

export default Dialogues;
