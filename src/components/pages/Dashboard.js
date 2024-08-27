import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Dashboard.css";
import { useAuth } from "contexts/authContext";
import { auth } from 'components/firebase/firebase';
import { DocumentContext } from '../../contexts/documentContext';

const ALLOWED_EXTENSIONS = ['pdf', 'docx'];

const backend_url = "http://127.0.0.1:5000"

const Dashboard = () => {
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState([]);
  const [questionDocumentsFiles, setQuestionDocumentsFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);
  const [textInputActive, setTextInputActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const { resetDashboard, addDocument } = useContext(DocumentContext);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (resetDashboard) {
      setKnowledgeBaseFiles([]);
      setQuestionDocumentsFiles([]);
      setLoading(false);
      setIsTextInputEnabled(false);
      setTextInputActive(false);
      setErrorMessage('');
      setQuestions([]);
    }
  }, [resetDashboard]);

  const knowledgeBaseInputRef = useRef(null);
  const questionDocumentsInputRef = useRef(null);

  const isValidFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(fileExtension);
  };

  const handleFileInputChange = () => {
    if (knowledgeBaseFiles.length > 0 && questionDocumentsFiles.length > 0) {
      setIsTextInputEnabled(true);
      setTextInputActive(true);
    } else {
      setIsTextInputEnabled(false);
    }
  };

  const handleFilesSelection = (event, setFiles) => {
    const files = Array.from(event.target.files);
    const invalidFiles = files.filter(file => !isValidFile(file));

    if (invalidFiles.length > 0) {
      setErrorMessage(`Only .pdf and .docx files are allowed. Invalid files: ${invalidFiles.map(file => file.name).join(', ')}`);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...files]);
    setErrorMessage('');
  };

  const handleDrop = (event, setFiles) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const invalidFiles = files.filter(file => !isValidFile(file));

    if (invalidFiles.length > 0) {
      setErrorMessage(`Only .pdf and .docx files are allowed. Invalid files: ${invalidFiles.map(file => file.name).join(', ')}`);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...files]);
    setErrorMessage('');
    event.dataTransfer.clearData();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleTextInputClick = () => {
    if (!textInputActive) {
      handleUpload();
    }
  };

  const handleUpload = async () => {

    if (knowledgeBaseFiles.length === 0 || questionDocumentsFiles.length > 0 && knowledgeBaseFiles.length === 0) {
      confirmAlert({
        title: 'Error',
        message: 'Please upload Knowledge Base files!',
        buttons: [
          {
            label: 'OK',
            onClick: () => { }
          }
        ]
      });
      return;
    }

    if (knowledgeBaseFiles.length > 0 && questionDocumentsFiles.length === 0) {
      confirmAlert({
        title: 'Confirm',
        message: 'Do you want to continue without uploading a Question Document?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => proceedWithUpload()
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      });
    } else {
      proceedWithUpload();
    }
  };

  const proceedWithUpload = async () => {
    console.log("Starting upload...");
    setLoading(true);

    const formData = new FormData();
    knowledgeBaseFiles.forEach((file) => {
      formData.append("knowledgeBaseFiles", file);
    });
    questionDocumentsFiles.forEach((file) => {
      formData.append("questionDocumentsFiles", file);
    });

    try {
      const token = await auth.currentUser.getIdToken(true);
      console.log("Token:", token);

      const uploadResponse = await axios.post(`${backend_url}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Files uploaded successfully:", uploadResponse.data);

      const questions = uploadResponse.data.questions;
      setQuestions(questions);
      addDocument(uploadResponse.data.documentName);
      handleFileInputChange();

      if (questions.length > 0) {
        setLoading(true);
        console.log("Sending question to the inference-questions service...");

        const inferenceResponse = await axios.post(`${backend_url}/inference-questions`, {
          text: questions[0]
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("Inference result received:", inferenceResponse.data);
        setLoading(false);
        typeQuestion(questions[0]);
      }

    } catch (error) {
      console.error("Error uploading files or sending question to the inference-questions service:", error);
    } finally {
      setLoading(false);
    }
  };



  const typeQuestion = (questionText) => {
    setDisplayedText("");
    let index = 0;
    const speed = 25;

    const formattedText = questionText.replace(/\n/g, "<br />");

    const timer = setInterval(() => {
      if (index < formattedText.length) {
        setDisplayedText((prev) => prev + formattedText[index]);
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {currentUser && (
          <div className="user-info">
            {/* <span>Welcome, {currentUser.displayName || currentUser.email}!</span> */}
          </div>
        )}
      </div>
      <div className="dashboard-content">
        {
          questions.length > 0 ? (
            <div className="chat-zone">
              { loading ? <p className="loading-text" >Loading....</p> : <></> }
              <p dangerouslySetInnerHTML={{ __html: displayedText }} />
            </div>
          ) : (
            <div className="drop-zones">
              <div
                className="drop-zone"
                id="knowledge-base"
                onDrop={(e) => handleDrop(e, setKnowledgeBaseFiles)}
                onDragOver={handleDragOver}
                onClick={() => !textInputActive && knowledgeBaseInputRef.current.click()} // Trigger file input dialog on click
              >
                <i className="fas fa-file-upload fa-3x"></i>
                <p>Knowledge Base</p>
                <ul>
                  {knowledgeBaseFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
                <input
                  type="file"
                  ref={knowledgeBaseInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={(e) => handleFilesSelection(e, setKnowledgeBaseFiles)}
                />
              </div>
              <div
                className="drop-zone"
                id="question-documents"
                onDrop={(e) => handleDrop(e, setQuestionDocumentsFiles)}
                onDragOver={handleDragOver}
                onClick={() => !textInputActive && questionDocumentsInputRef.current.click()} // Trigger file input dialog on click
              >
                <i className="fas fa-file-upload fa-3x"></i>
                <p>Question Documents</p>
                <ul>
                  {questionDocumentsFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
                <input
                  type="file"
                  ref={questionDocumentsInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={(e) => handleFilesSelection(e, setQuestionDocumentsFiles)}
                />
              </div>
            </div>
          )
        }

      </div>
      <div className="file-name">
        {loading ? (
          <div className="loading-container" style={{ height: "unset", marginBottom: "25%" }} >
            <div className="loading-spinner"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <p> {questions.length > 0 ? "" : "Drop your files to upload"} </p>
        )}
      </div>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      <div onClick={handleTextInputClick} className="search-button-container">
        <input
          className="search-button"
          type="text"
          placeholder={!isTextInputEnabled ? "Upload your files" : "Type your question"}
          style={!isTextInputEnabled ? { pointerEvents: 'none' } : {}}
        />
      </div>
    </div>
  );
};

export default Dashboard;
