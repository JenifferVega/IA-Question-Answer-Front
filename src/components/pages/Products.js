import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import "../../App.css";

export default function Products() {
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState([]);
  const [questionDocumentsFiles, setQuestionDocumentsFiles] = useState([]);

  const handleDrop = (event, setFiles) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="products-container" style={{ margin:0 }}>
      <div className="products" style={{ flexDirection:'column' }}>
        <h1 style={{ color:"antiquewhite" }} >Drop your files!</h1>
        <br/>
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
      </div>
    </div>
  );
}
