// types
import IDialogue from "../IDialogue";

export default interface DialogueResponse {
  status: string;
  message: string;
  dialogue: IDialogue;
}

export interface DialoguesResponse {
  status: string;
  dialogues: IDialogue[];
}
