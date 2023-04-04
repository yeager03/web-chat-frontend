import { FC, ReactElement, Fragment } from "react";

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
		<Fragment>
			<Box className={styles["dialogues"]}>
				<Box className={styles["dialogues__header"]}>
					<QuestionAnswerRoundedIcon sx={{ fontSize: 21 }} />
					<Typography variant="h2">Список диалогов</Typography>
				</Box>

				<Box className={styles["dialogues__list"]}>
					<DialoguesList />
				</Box>
			</Box>

			<Chat />
		</Fragment>
	);
};

export default Dialogues;
