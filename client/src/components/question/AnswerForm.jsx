import { useEffect, useRef, useState } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import api from "../../api/axios";

export default function AnswerForm({ questionId, onSubmit }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [loading, setLoading] = useState(false);

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

      hooks: {
        addImageBlobHook: async (blob, callback) => {
          try {
            const formData = new FormData();
            formData.append("image", blob);

            const res = await api.post(
              "/problem/upload", // reuse cloudinary endpoint
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            callback(res.data.url, blob.name);
          } catch (error) {
            console.error("Image upload failed:", error);
            alert("Image upload failed");
          }
        },
      },
    });

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, []);

  const handlePost = async () => {
    if (!editorInstance.current) return;

    const body = editorInstance.current.getMarkdown();

    if (!body.trim()) {
      return alert("Answer cannot be empty");
    }

    try {
      setLoading(true);

      const res = await api.post("/answer", {
        questionId,
        body,
      });

      // send real backend answer to parent
      onSubmit(res.data.data);

      editorInstance.current.setMarkdown("");

      alert("Answer posted successfully 🎉");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to post answer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Your Answer</h3>

      <div ref={editorRef}></div>

      <button
        className="btn-primary"
        onClick={handlePost}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Answer"}
      </button>
    </div>
  );
}