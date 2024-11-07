import React, { useState, useRef } from "react"; // Import useRef
import { Button, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import "./Compose.css"; // Assuming you will create this CSS file for styling
import { sendEmail } from "../store/email-actions";


function Compose() {
  const [subject, setSubject] = useState("");
  const dispatch=useDispatch();
  const [recipient, setRecipient] = useState("");
  const userEmail=useSelector(state=>state.auth.email);
  
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef(); // Create ref for the editor
  const navigate = useNavigate();

  const handleSend = () => {

    try {
      const contentState = editorState.getCurrentContent();
  
      // Check if there is any content before converting
      if (!contentState || !contentState.hasText()) {
        console.log("Editor is empty or content is invalid.");
        return;
      }
  
      // Convert contentState to raw format safely
      const rawContent = convertToRaw(contentState);
      const message = JSON.stringify(rawContent);
  
      
  
      const emailData = {
        sender:userEmail,
        recipient,
        subject,
        message,
      };
  
      dispatch(sendEmail(emailData));
    } catch (error) {
      console.error("Error converting content to raw format:", error);
    }

   
  };

  

  const handleClose = () => {
    navigate("/home");
  };

  // Focus the editor when the component mounts
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div className="compose-background">
    <div className="compose-container">
      <div className="compose-header">
        <h1>New Message</h1>
        <Button variant="light" className="close-btn" onClick={handleClose}>
          &times;
        </Button>
      </div>

      <Form.Group controlId="formTo" className="mb-2">
        <Form.Control
          type="email"
          placeholder="To"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formSubject" className="mb-2">
        <Form.Control
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Form.Group>

      {/* The editor is placed below the subject field */}
      <div className="editor-container">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={setEditorState}
        />
      </div>

      {/* Footer with buttons and toolbar */}
      <div className="compose-footer">
        <div className="footer-buttons">
          <Button variant="secondary" onClick={() => console.log('Discarded')} className="discard-btn">
            Discard
          </Button>
        </div>
        
        {/* Toolbar */}
        <div className="toolbar-container">
          {/* You can add your custom toolbar here if needed */}
        </div>

        <div className="footer-buttons">
          <Button variant="primary" onClick={handleSend} className="send-btn">
            Send
          </Button>
        </div>
      </div>
    </div>
    </div>
);
}

export default Compose;

