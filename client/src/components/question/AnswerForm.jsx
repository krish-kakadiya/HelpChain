import { useEffect, useRef } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function AnswerForm({ onSubmit }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorInstance.current) return;

    editorInstance.current = new Editor({
      el: editorRef.current,
      height: "300px",
      initialEditType: "markdown",
      previewStyle: "vertical",
      placeholder: "Write your answer in Markdown...",
      usageStatistics: false,
      toolbarItems: [
        ["heading", "bold", "italic", "strike"],
        ["hr", "quote"],
        ["ul", "ol"],
        ["link", "image"],
        ["code", "codeblock"],
      ],
    });

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, []);

  const handlePost = () => {
    if (!editorInstance.current) return;

    // ✅ STORE MARKDOWN (NOT HTML)
    const markdownContent = editorInstance.current.getMarkdown();

    if (!markdownContent.trim()) return;

    const newAnswer = {
      body: markdownContent, // 🔥 Markdown stored
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onSubmit(newAnswer);

    // ✅ Clear editor properly
    editorInstance.current.setMarkdown("");
  };

  return (
    <div className="card">
      <h3>Your Answer</h3>
      <div ref={editorRef}></div>
      <button className="btn-primary" onClick={handlePost}>
        Post Answer
      </button>
    </div>
  );
}
