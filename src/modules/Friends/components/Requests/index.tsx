import { FC, ReactElement } from "react";

// containers
import RequestsList from "../../containers/RequestsList";

// mui components
import { Typography, Box } from "@mui/material";

// mui icons
import Diversity2RoundedIcon from "@mui/icons-material/Diversity2Rounded";

// style
import styles from "./Requests.module.scss";

const Requests: FC = (): ReactElement => {
	return (
		<Box className={styles["requests"]}>
			<Box className={styles["requests__header"]}>
				<Diversity2RoundedIcon sx={{ fontSize: 24 }} />
				<Typography variant="h2">Заявки в друзья</Typography>
			</Box>

			<Box className={styles["requests__list"]}>
				<RequestsList />
			</Box>
		</Box>
	);
};

export default Requests;
