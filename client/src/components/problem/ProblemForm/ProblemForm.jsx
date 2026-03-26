import { useEffect, useRef, useState } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "./ProblemForm.css";
import api from "../../../api/axios.js";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function ProblemForm() {
  const { refreshUser } = useAuth();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new Editor({
        el: editorRef.current,
        height: "400px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        placeholder: "Describe your problem in detail...",
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
                "/problem/upload",
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
    }

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, []);

  const handleSubmit = async () => {
    try {
      const body = editorInstance.current.getMarkdown();

      // 🔒 Basic Validation
      if (title.trim().length < 10) {
        return alert("Title must be at least 10 characters");
      }

      if (body.trim().length < 20) {
        return alert("Description must be at least 20 characters");
      }

      const payload = {
        title: title.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        body,
      };

      setLoading(true);

      const res = await api.post("/problem", payload);

      alert("Question posted successfully 🎉");

      console.log(res.data);
      refreshUser(); // Update points automatically

      // 🔄 Reset Form
      setTitle("");
      setTags("");
      editorInstance.current.setMarkdown("");

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to post question"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-wrapper">
      <h1 className="pf-title">Ask a public question</h1>

      {/* Title */}
      <label className="pf-label">Title</label>
      <input
        className="pf-input"
        type="text"
        placeholder="e.g. Why does React re-render twice in StrictMode?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Editor */}
      <label className="pf-label">
        What are the details of your problem?
      </label>
      <div ref={editorRef} className="pf-editor" />

      {/* Tags */}
      <label className="pf-label">
        Tags <span className="pf-label__hint">(comma separated)</span>
      </label>
      <input
        className="pf-input"
        type="text"
        placeholder="react, markdown, toast-ui"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* Submit */}
      <button
        className="pf-submit"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post your question"}
      </button>
    </div>
  );
}