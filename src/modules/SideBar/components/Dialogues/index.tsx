import { FC, ReactElement, Fragment, ChangeEvent } from "react";

// classnames
import cn from "classnames";

// lodash
import orderBy from "lodash/orderBy";

// antd components
import { Input, Empty } from "antd";

// components
import Dialogue from "../Dialogue";

// icons
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";

// styles
import styles from "./Dialogues.module.scss";

// types
import { Dialogue as DialogueItem, Status } from "../../../../store/slices/dialoguesSlice";

type DialoguesProps = {
	status: Status;
	dialogues: DialogueItem[];
	searchValue: string;
	handleChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
	// dialogue
	currentDialogueID: string;
	handleClickDialogue: (id: string) => void;
};

const Dialogues: FC<DialoguesProps> = (props): ReactElement => {
	const { status, dialogues, searchValue, handleChangeValue, currentDialogueID, handleClickDialogue } = props;

	const loading = status === "loading" ? <LoadingOutlined className={styles["icon"]} /> : null;
	const empty =
		status === "success" && !dialogues.length ? (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Ничего не найдено 😔" className={styles["icon"]} />
		) : null;
	const sortedDialogues =
		status === "success" && dialogues.length
			? orderBy(dialogues, ["created_at"], ["desc"]).map((dialogue) => (
					<Dialogue
						key={dialogue["_id"]}
						{...dialogue}
						currentDialogueID={currentDialogueID}
						handleClickDialogue={handleClickDialogue}
					/>
			  ))
			: null;

	return (
		<Fragment>
			<div className={styles["dialogues__search"]}>
				<Input
					size="large"
					placeholder="Поиск среди контактов"
					prefix={<SearchOutlined className={styles["icon"]} />}
					className={styles["input"]}
					value={searchValue}
					onChange={handleChangeValue}
				/>
			</div>

			<div
				className={cn(styles["dialogues__items"], {
					[styles["dialogues__items_empty"]]: !dialogues.length,
				})}
			>
				{loading}
				{empty}
				{sortedDialogues}
			</div>
		</Fragment>
	);
};

export default Dialogues;
