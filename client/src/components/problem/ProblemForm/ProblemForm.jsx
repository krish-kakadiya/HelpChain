import { useEffect, useRef, useState } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "./ProblemForm.css";

export default function ProblemForm() {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

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

        /**
         * 🔥 Handles:
         * - Image button upload
         * - Paste screenshots (Ctrl+V)
         * - Drag & drop images
         */
        hooks: {
          addImageBlobHook: async (blob, callback) => {
            try {
              // FRONTEND responsibility
              // const formData = new FormData();
              // formData.append("image", blob);

              // Replace with real endpoint later
              // const res = await fetch("/api/upload-image", {
              //   method: "POST",
              //   body: formData,
              // });

              // const data = await res.json();
              if (!blob || !blob.type.startsWith("image/")) {
                return;
              }


              const fakeUrl = URL.createObjectURL(blob);
              callback(fakeUrl, blob.name);


              // Insert markdown automatically
              // callback(data.url, blob.name);
            } catch (error) {
              console.error("Image upload failed", error);
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

  const handleSubmit = () => {
    const body = editorInstance.current.getMarkdown();

    const payload = {
      title: title.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      body,
    };

    console.log("POST DATA →", payload);

    // Ready for backend
    /*
    fetch("/api/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    */
  };

  return (
    <div className="problem-form">
      <h1>Ask a public question</h1>

      {/* Title */}
      <label className="label">Title</label>
      <input
        className="input"
        type="text"
        placeholder="e.g. Why does React re-render twice in StrictMode?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Editor */}
      <label className="label">What are the details of your problem?</label>
      <div ref={editorRef} className="editor-container" />

      {/* Tags */}
      <label className="label">
        Tags <span>(comma separated)</span>
      </label>
      <input
        className="input"
        type="text"
        placeholder="react, markdown, toast-ui"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* Submit */}
      <button className="submit-btn" onClick={handleSubmit}>
        Post your question
      </button>
    </div>
  );
}
