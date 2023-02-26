// axios
import axios from "../../core/axios";

// types
import { Dialogue } from "../../store/slices/dialoguesSlice";

export default {
	getAll: () => axios.get<Dialogue[]>("/dialogues"),
};
