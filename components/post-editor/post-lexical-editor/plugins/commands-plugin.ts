import { useEffect } from "react";
import {
  COMMAND_PRIORITY_LOW,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const CommandsPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<TextFormatType>(
        FORMAT_TEXT_COMMAND,
        (_format) => {
          // Ignore this command
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<ElementFormatType>(
        FORMAT_ELEMENT_COMMAND,
        (_format) => {
          // Ignore this command
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
};
