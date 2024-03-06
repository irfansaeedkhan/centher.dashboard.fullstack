import React from "react";
import { useShallow } from "zustand/react/shallow";
import { usePostEditorStore } from "@/store/post-editor-store";
import { LoggedInUser } from "@/models/user";
import { IEditorPost } from "../shared/types";

interface Props {
  user: LoggedInUser;
  post: IEditorPost;
  openBuyCitizenshipModal: () => void;
}

export const NonCitizenWarningBanner: React.FC<Props> = ({
  user,
  post,
  openBuyCitizenshipModal,
}) => {
  const { isCitizenshipRequired } = usePostEditorStore(
    useShallow((state) => state.actions)
  );

  return isCitizenshipRequired(post.uuid, user) ? (
    <div className="gradient-border-3 m-4 rounded-md bg-[#1A1B21] p-px *:p-2">
      <div className="text-sm font-semibold text-white">Become a Citizen</div>
      <div className="text-xs font-medium leading-tight text-[#A0A4BB]">
        Purchase your Citizen Passport and take advantage of our premium
        features like writing endless posts and much more.
      </div>
      <button
        onClick={openBuyCitizenshipModal}
        className="textGradient cursor-pointer text-sm"
      >
        Purchase Citizen Passport
      </button>
    </div>
  ) : null;
};
