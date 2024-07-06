import React from "react";
import "../../App.css";

export default function QuestionsAnswers({ extractedText }) {
    console.log("extractedText",extractedText);
  return (
    <div className="question-answer-container">
      {extractedText.questions.length > 0 && (
        <div>
          <h2>Questions found:</h2>
          {extractedText.questions.map((text, index) => (
            <div key={index} className="question-answer">
              <h3>Question {index + 1}</h3>
              <p>{text}</p>
              <div className="loading-spinner"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
