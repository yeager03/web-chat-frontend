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
import { Status } from "../../../../models/Status";
import IDialogue from "../../../../models/IDialogue";

type DialoguesProps = {
	status: Status;
	dialogues: IDialogue[];
	searchValue: string;
	handleChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
	// dialogue
	currentDialogueId: string;
};

const Dialogues: FC<DialoguesProps> = (props): ReactElement => {
	const { status, dialogues, searchValue, handleChangeValue, currentDialogueId } = props;

	const loading = status === "loading" ? <LoadingOutlined className={styles["icon"]} /> : null;
	const empty =
		status === "success" && !dialogues.length ? (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Ничего не найдено 😔" className={styles["icon"]} />
		) : null;
	const sortedDialogues =
		status === "success" && dialogues.length
			? orderBy(dialogues, ["createdAt"], ["desc"]).map((dialogue) => (
					<Dialogue key={dialogue["_id"]} {...dialogue} currentDialogueId={currentDialogueId} />
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

			<ul
				className={cn(styles["dialogues__items"], {
					[styles["dialogues__items_empty"]]: !dialogues.length,
				})}
			>
				{loading}
				{empty}
				{sortedDialogues}
			</ul>
		</Fragment>
	);
};

export default Dialogues;
