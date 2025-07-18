import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Blockquote,
      HorizontalRule,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[160px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-yellow)] bg-white text-base",
        placeholder: placeholder || "Start writing...",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <div className="border rounded-md p-3 bg-white text-base min-h-[160px]">Loading editor...</div>;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 border-b pb-2 bg-[var(--muted)] rounded-t-md px-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded font-bold transition-colors ${editor.isActive('bold') ? 'bg-[var(--accent-yellow)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent-yellow)]/60'}`}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded italic transition-colors ${editor.isActive('italic') ? 'bg-[var(--accent-yellow)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent-yellow)]/60'}`}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded underline transition-colors ${editor.isActive('underline') ? 'bg-[var(--accent-yellow)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent-yellow)]/60'}`}>U</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`px-2 py-1 rounded line-through transition-colors ${editor.isActive('strike') ? 'bg-[var(--accent-yellow)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent-yellow)]/60'}`}>S</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`px-2 py-1 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-[var(--accent-yellow)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent-yellow)]/60'}`}>&#8220; &#8221;</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-1 rounded transition-colors hover:bg-[var(--accent-yellow)]/60">―</button>
        <button type="button" onClick={() => {
          const url = window.prompt('Enter a URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className={`px-2 py-1 rounded transition-colors ${editor.isActive('link') ? 'bg-[var(--accent-yellow)] text-[var(--text-primary)]' : 'hover:bg-[var(--accent-yellow)]/60'}`}>🔗</button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className="px-2 py-1 rounded transition-colors hover:bg-[var(--accent-yellow)]/60">❌🔗</button>
      </div>
      <div className="prose prose-lg max-w-none bg-white border border-[var(--border)] rounded-b-md p-4 min-h-[160px] focus-within:ring-2 focus-within:ring-[var(--accent-yellow)] transition-shadow">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor; 