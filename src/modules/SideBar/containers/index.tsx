import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

// components
import BaseSideBar from "../components";

// dispatch
import { useAppDispatch } from "../../../store";

// socket
import { socket } from "../../../core/socket";

// actions
import { logOut } from "../../../store/slices/user/authActions";
import {
  setCurrentDialogue,
  setCurrentDialogueId,
} from "../../../store/slices/dialogue/dialogueSlice";
import { socketClearMessages } from "../../../store/slices/message/messageSlice";

// hooks
import useAuth from "../../../hooks/useAuth";
import useAudio from "../../../context/context";

// selector
import { friendSelector } from "../../../store/slices/friend/friendSlice";

const SideBar: FC = (): ReactElement => {
  const { user } = useAuth();
  const { clearAudioFiles } = useAudio();
  const { requestsLength } = useSelector(friendSelector);

  const dispatch = useAppDispatch();

  const logout = () => {
    clearAudioFiles();
    dispatch(logOut());
    socket.emit("logout");
  };

  const handleChangeLink = () => {
    dispatch(setCurrentDialogueId(""));
    dispatch(setCurrentDialogue(null));
    dispatch(socketClearMessages());
    clearAudioFiles();
  };

  return (
    <BaseSideBar
      user={user}
      logout={logout}
      requestsLength={requestsLength}
      handleChangeLink={handleChangeLink}
    />
  );
};

export default SideBar;
