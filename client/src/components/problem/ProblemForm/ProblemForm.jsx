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

        hooks: {
          addImageBlobHook: async (blob, callback) => {
            try {
              if (!blob || !blob.type.startsWith("image/")) return;

              const fakeUrl = URL.createObjectURL(blob);
              callback(fakeUrl, blob.name);

              // Replace with Cloudinary upload when ready:
              // const formData = new FormData();
              // formData.append("file", blob);
              // formData.append("upload_preset", "your_preset");
              // const res = await fetch(`https://api.cloudinary.com/v1_1/your_cloud/image/upload`, { method: "POST", body: formData });
              // const data = await res.json();
              // callback(data.secure_url, blob.name);
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
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      body,
    };

    console.log("POST DATA →", payload);

    // fetch("/api/problems", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
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
      <label className="pf-label">What are the details of your problem?</label>
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
      <button className="pf-submit" onClick={handleSubmit}>
        Post your question
      </button>
    </div>
  );
}