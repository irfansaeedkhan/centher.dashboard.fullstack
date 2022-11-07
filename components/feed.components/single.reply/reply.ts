export interface ModalProps {
  onClose: () => void;
  user: {
    display_name: string;
    profile_image: {
      path: string;
      object_name: string;
    };
  };
  lastItem: number;
  setLastItem: React.Dispatch<React.SetStateAction<number>>;
  createPost: (post: string) => void;
  displaySelectedFiles: JSX.Element[];
  deleteText: () => void;
  loadingState: boolean;
  uploadingFileStatus: number | undefined;
  handleTextLength: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  tweetText: string;
  handleSelectFile: (
    e: React.ChangeEvent<HTMLInputElement>,
    file_type: string
  ) => void;
  onEmojiClick: any;
  isEmojiPickerVisible: boolean;
  setIsEmojiPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  emojiPickerRef: React.RefObject<HTMLDivElement>;
}
