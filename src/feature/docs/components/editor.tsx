import {
  useLiveblocksExtension,
  FloatingToolbar,
} from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import { useEditorStore } from "@/feature/docs/store/use-editor-store";
import StarterKit from "@tiptap/starter-kit";
import { Threads } from "./threads";

// import Document from "@tiptap/extension-document";
// import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlighte from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
// import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
// import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface EditorProps {
  initialContent?: string | undefined;
}

export function Editor({ initialContent }: EditorProps) {
  const liveblocks = useLiveblocksExtension({
    initialContent,
  });
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${56}px; padding-right: ${56}px; padding-top: ${32}px`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[960px] w-[816px] pt-10 pr-14 pb-10 ",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        // The Liveblocks extension comes with its own history handling
        history: false,
      }),
      // LineHeightExtension.configure({
      //   types: ["heading", "paragraph"],
      //   defaultLineHeight: "normal",
      // }),
      // FontSizeExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      Highlighte.configure({ multicolor: true }),
      FontFamily,
      Document,
      // Paragraph,
      Text,
      TextStyle,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      // Dropcursor,
      Image,
      // ImageResize,
    ],
    content: ``,
  });

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      <div className="flex-1 overflow-auto bg-[#FAFCFD] px-4 print:p-0 print:bg-white print:overflow-visible scrollbar-thin scrollbar-thumb-[#E5E7EB] hover:scrollbar-thumb-[#D1D5DB]">
        <div className="flex justify-center py-4 print:py-0">
          <div className="w-[816px] relative">
            <EditorContent editor={editor} className="editor" />
            <Threads editor={editor} />
            <FloatingToolbar editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
