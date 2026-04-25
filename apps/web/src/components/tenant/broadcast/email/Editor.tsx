"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import Suggestion from "@tiptap/suggestion";
import { SlashCommand } from "./SlashCommand";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock users (replace with API later)
const USERS = [
  { id: "1", label: "John Doe" },
  { id: "2", label: "Jane Smith" },
  { id: "3", label: "Alex Johnson" },
];

export function RichTextEditor() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<typeof USERS>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit,

      Placeholder.configure({
        placeholder: "Write your email template...",
      }),

      // ✅ Mentions (@user)
      Mention.configure({
        HTMLAttributes: {
          class: "text-blue-600 font-medium",
        },
        suggestion: {
          char: "@",
          items: ({ query }) => {
            return USERS.filter((user) =>
              user.label.toLowerCase().includes(query.toLowerCase()),
            );
          },
          render: () => {
            let component: any;

            return {
              onStart: (props) => {
                setShowMenu(true);
                setItems(props.items);
                setCoords(props.clientRect?.() || { top: 0, left: 0 });
              },
              onUpdate(props) {
                setItems(props.items);
                setCoords(props.clientRect?.() || { top: 0, left: 0 });
              },
              onExit() {
                setShowMenu(false);
              },
            };
          },
        },
      }),

      // ✅ Slash command (/)
    ],
    content: "",
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full relative">
      {/* ✅ Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b px-3 py-2 flex gap-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>
      </div>

      {/* ✅ Editor */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <EditorContent editor={editor} className="prose prose-sm max-w-none" />
      </div>

      {/* ✅ Floating menu (mentions + slash) */}
      {showMenu && (
        <div
          className="absolute z-50 bg-white border rounded-md shadow-md w-48"
          style={{ top: coords.top + 25, left: coords.left }}
        >
          {items.map((item: any, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.command) item.command({ editor });
                else
                  editor.chain().focus().insertContent(`@${item.label} `).run();
                setShowMenu(false);
              }}
              className="block w-full text-left px-3 py-2 hover:bg-slate-100 text-sm"
            >
              {item.label || item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
