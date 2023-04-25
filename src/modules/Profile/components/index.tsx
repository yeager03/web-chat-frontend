import { FC, ReactElement, ChangeEvent, FormEvent, useState, useEffect, RefObject } from "react";

// mui components
import { Typography, TextField, Box } from "@mui/material";

// components
import Button from "../../../components/Button";

// mui icons
import { ManageAccountsRounded } from "@mui/icons-material";

// style
import styles from "./Profile.module.scss";

// types
import { ProfileValues } from "../containers";
import { FormikErrors, FormikTouched } from "formik";
import UserAvatar from "../../../components/UserAvatar";
import IUser from "../../../models/IUser";
import { IFile } from "../../../models/IMessage";

type ProfileProps = {
	// formik
	isSubmitting: boolean;
	values: ProfileValues;
	touched: FormikTouched<ProfileValues>;
	errors: FormikErrors<ProfileValues>;
	handleChange: (e: ChangeEvent<any>) => void;
	handleBlur: (e: any) => void;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	// file, user
	user: IUser | null;
	image: IFile | null;
	fileImage: File | null;
	fileInputRef: RefObject<HTMLInputElement>;
	isValid: boolean;
	handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void;
	handleFilePick: () => void;
};

const Profile: FC<ProfileProps> = (props): ReactElement => {
	const {
		isSubmitting,
		values,
		touched,
		errors,
		user,
		image,
		fileImage,
		fileInputRef,
		isValid,
		handleChange,
		handleBlur,
		handleSubmit,
		handleChangeImage,
		handleFilePick,
	} = props;

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		const name = user?.fullName.split(" ")[0],
			surname = user?.fullName.split(" ")[1],
			about_me = user?.about_me ? user.about_me : "";

		if (name !== values["name"] || surname !== values["surname"] || about_me !== values["about_me"] || fileImage) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [values, fileImage]);

	return (
		<>
			{user && (
				<Box className={styles["profile"]}>
					<Box className={styles["profile__title"]}>
						<ManageAccountsRounded sx={{ fontSize: 22 }} />
						<Typography variant="h2">Мой профиль</Typography>
					</Box>

					<Box className={styles["profile__form"]}>
						<form onSubmit={handleSubmit}>
							<input
								type="file"
								accept="image/*,.png,.jpg,.jpeg,.gif,.web"
								className="input_hidden"
								hidden
								ref={fileInputRef}
								onChange={handleChangeImage}
								onClick={(event) => ((event.target as HTMLInputElement).value = "")}
							/>

							<Box className={styles["profile__form-avatar"]} onClick={handleFilePick}>
								<UserAvatar
									user={{
										...user,
										avatar: image ? image : user.avatar,
									}}
								/>
							</Box>
							<Box className={styles["profile__form-fullName"]}>
								<TextField
									fullWidth
									id={`${
										!touched["name"] ? "outlined-name" : errors["name"] ? "outlined-error" : "outlined-name"
									}`}
									type="text"
									label="Имя"
									name="name"
									error={!touched["name"] ? false : errors["name"] ? true : false}
									helperText={!touched["name"] ? " " : errors["name"] ? errors["name"] : " "}
									value={values["name"]}
									onChange={handleChange}
									onBlur={handleBlur}
									sx={{
										"& fieldset": {
											borderRadius: "8px",
										},
									}}
									FormHelperTextProps={{
										sx: {
											margin: 0,
											marginLeft: "5px",
											fontWeight: 600,
											height: "15px",
											opacity: !touched["name"] ? 0 : errors["name"] ? 1 : 0,
											transition: "opacity .25s ease-out",
										},
									}}
								/>

								<TextField
									fullWidth
									id={`${
										!touched["surname"]
											? "outlined-surname"
											: errors["surname"]
											? "outlined-error"
											: "outlined-surname"
									}`}
									type="text"
									label="Фамилия"
									name="surname"
									error={!touched["surname"] ? false : errors["surname"] ? true : false}
									helperText={!touched["surname"] ? " " : errors["surname"] ? errors["surname"] : " "}
									value={values["surname"]}
									onChange={handleChange}
									onBlur={handleBlur}
									sx={{
										"& fieldset": {
											borderRadius: "8px",
										},
									}}
									FormHelperTextProps={{
										sx: {
											margin: 0,
											marginLeft: "5px",
											fontWeight: 600,
											height: "15px",
											opacity: !touched["surname"] ? 0 : errors["surname"] ? 1 : 0,
											transition: "opacity .25s ease-out",
										},
									}}
								/>
							</Box>

							<TextField
								fullWidth
								label="О себе..."
								name="about_me"
								multiline
								rows={3}
								error={errors["about_me"] ? true : false}
								helperText={errors["about_me"] ? errors["about_me"] : " "}
								defaultValue={values["about_me"]}
								onChange={handleChange}
								sx={{
									"& fieldset": {
										borderRadius: "8px",
									},
									marginBottom: "10px",
								}}
								FormHelperTextProps={{
									sx: {
										margin: 0,
										marginLeft: "5px",
										fontWeight: 600,
										height: "15px",
										opacity: errors["about_me"] ? 1 : 0,
										transition: "opacity .25s ease-out",
									},
								}}
							/>

							<Button
								loading={isSubmitting}
								type="submit"
								className={styles["profile__form-button"]}
								disabled={disabled || isValid}
							>
								Сохранить
							</Button>
						</form>
					</Box>
				</Box>
			)}
		</>
	);
};

export default Profile;
