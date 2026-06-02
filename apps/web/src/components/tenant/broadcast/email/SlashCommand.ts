import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

interface SlashCommandPayload {
  editor: unknown;
  range: unknown;
  props: {
    command: (payload: { editor: unknown; range: unknown }) => void;
  };
}

export const SlashCommand = Extension.create({
  name: "slash-command",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }: SlashCommandPayload) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
