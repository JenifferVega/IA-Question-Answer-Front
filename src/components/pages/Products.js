import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../../App.css";
import QuestionsAnswers from "./QuestionsAnswers";

export default function Products() {
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState([]);
  const [questionDocumentsFiles, setQuestionDocumentsFiles] = useState([]);
  const [extractedText, setExtractedText] = useState({
    questions: [],
  });
  const [loading, setLoading] = useState(false);

  const handleDrop = (event, setFiles) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (knowledgeBaseFiles.length === 0 || questionDocumentsFiles.length === 0) {
      alert("Please upload files for both sections.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    knowledgeBaseFiles.forEach((file) => {
      formData.append("knowledgeBaseFiles", file);
    });
    questionDocumentsFiles.forEach((file) => {
      formData.append("questionDocumentsFiles", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setExtractedText(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  };

  return (
    <div className="products" style={{ margin: 0, height: extractedText.questions.length == 0 ? "100%" : "unset"  }}>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div style={{ height: extractedText.questions.length > 0 ? "100%" : "unset" }}>
          <h1 style={{ color: "antiquewhite" }}>Drop your files!</h1>
          <br />
          <div className="drop-zones">
            <div
              className="drop-zone"
              id="knowledge-base"
              onDrop={(e) => handleDrop(e, setKnowledgeBaseFiles)}
              onDragOver={handleDragOver}
            >
              <FontAwesomeIcon icon={faFileUpload} size="3x" />
              <p>Knowledge Base</p>
              <ul>
                {knowledgeBaseFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
            <div
              className="drop-zone"
              id="question-documents"
              onDrop={(e) => handleDrop(e, setQuestionDocumentsFiles)}
              onDragOver={handleDragOver}
            >
              <FontAwesomeIcon icon={faFileUpload} size="3x" />
              <p>Question Documents</p>
              <ul>
                {questionDocumentsFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <button
              onClick={handleUpload}
              style={{ marginTop: 50 }}
              className="btn btn--outline btn--medium"
            >
              UPLOAD FILES
            </button>
          </div>
          <QuestionsAnswers extractedText={extractedText} />
        </div>
      )}
    </div>
  );
}
