import { createContext, useContext } from "react";
import { ICommentState } from "../types";

export const ReplyStateContext = createContext<ICommentState>(null);

export function useReply() {
  return useContext(ReplyStateContext);
}