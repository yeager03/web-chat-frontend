import { FC, ReactElement, ChangeEvent, useRef, useState } from "react";

// dispatch
import { useAppDispatch } from "../../../store";

// actions

// components
import BaseProfile from "../components";

// utils
import getNotification from "../../../utils/notification";
import getTrimmedFields from "../../../utils/trimFields";

// services
import UserService from "../../../services/UserService";

// types
import UserResponse from "../../../models/response/UserResponse";

// formik
import { useFormik } from "formik";

// patterns
import getPatterns from "../../../utils/validationPatterns";

// hooks
import useAuth from "../../../hooks/useAuth";
import { IFile } from "../../../models/IMessage";
import { setNewProfile } from "../../../store/slices/user/userSlice";

export type ProfileValues = {
  name: string;
  surname: string;
  about_me: string;
};

const Profile: FC = (): ReactElement => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [fileImage, setFileImage] = useState<File | null>(null);
  const [image, setImage] = useState<IFile | null>(user && user.avatar);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: user?.fullName.split(" ")[0],
      surname: user?.fullName.split(" ")[1],
      about_me: user?.about_me ? user.about_me : "",
    } as ProfileValues,
    validate: (values: ProfileValues) => {
      const errors: Record<string, string> = {};
      const data = getTrimmedFields(values) as ProfileValues;
      const { fullName } = getPatterns();

      if (data["name"] === "") {
        errors["name"] = "Введите ваше имя";
      } else if (!fullName.test(data["name"])) {
        errors["name"] = "Введите корректное имя";
      }

      if (data["surname"] === "") {
        errors["surname"] = "Введите вашу фамилию";
      } else if (!fullName.test(data["surname"])) {
        errors["surname"] = "Введите корректную фамилию";
      }

      if (data["about_me"].length > 200) {
        errors["about_me"] =
          "Максимальная длина текста составляет 200 символов";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      const data = getTrimmedFields(values) as ProfileValues;

      formData.append("fullName", `${data.name} ${data.surname}`);
      formData.append("about_me", data.about_me);
      fileImage && formData.append("file", fileImage);

      setSubmitting(true);

      try {
        const { data } = await UserService.editProfile(formData);
        const { status, message, user }: UserResponse = data;

        if (status === "success") {
          getNotification(message, status);

          dispatch(setNewProfile(user));
        }
      } catch (error: any) {
        const { message, status } = error.response.data;

        getNotification(message, status);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFilePick = () =>
    fileInputRef.current && fileInputRef.current.click();

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      if (file.type.match(getPatterns().image)) {
        if (file.size <= 5000000) {
          setFileImage(file);
          setImage({
            _id: `${file.name}${file.size}`,
            url: URL.createObjectURL(file),
            fileName: file.name,
            size: file.size,
            extension: file.type.split("/")[1],
            type: "image",
          });
        } else {
          return getNotification(
            "Размер картинки не должен превышать 5 мегабайт!",
            "error"
          );
        }
      } else {
        return getNotification(
          "Выбранный вами файл, не является картинкой!",
          "error"
        );
      }
    }
  };

  return (
    <BaseProfile
      isSubmitting={formik.isSubmitting}
      values={formik.values}
      touched={formik.touched}
      errors={formik.errors}
      handleChange={formik.handleChange}
      handleBlur={formik.handleBlur}
      handleSubmit={formik.handleSubmit}
      user={user}
      image={image}
      fileImage={fileImage}
      fileInputRef={fileInputRef}
      handleFilePick={handleFilePick}
      handleChangeImage={handleChangeImage}
      isValid={!formik.isValid}
    />
  );
};

export default Profile;
