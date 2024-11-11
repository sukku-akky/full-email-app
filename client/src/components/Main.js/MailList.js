import React, { useEffect, useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash } from "react-bootstrap-icons";
import {
  getInboxMails,
  deleteEmail,
  getSentMails,
  markEmailAsRead,
} from "../../store/email-actions";
import { useDispatch, useSelector } from "react-redux";
import { emailActions } from "../../store/redux-store";
//import { getMails } from '../services/mailService'; // Assume this fetches data from Firebase

const MailList = ({ folder }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.email);
  const inboxEmails = useSelector((state) => state.email.receivedEmails) || [];
  const sentEmails = useSelector((state) => state.email.sentEmails) || [];
  const [selectedEmail,setSelectedEmail]=useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the date format as needed
  };

  const handleMessageClick = (email) => {
    dispatch(markEmailAsRead(email._id, email.sender === userEmail));
    setSelectedEmail(email);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);// Go back to the email list
  };

  const handleDeleteEmail = (email) => {
    dispatch(deleteEmail(email._id, email.sender === userEmail));
    setSelectedEmail(null);
  };

  useEffect(() => {
    if (folder === "inbox") {
      dispatch(getInboxMails(userEmail));
    } else if (folder === "sent") {
      dispatch(getSentMails(userEmail));
    }
  }, [folder, dispatch, userEmail]);

  useEffect(() => {
    // Poll for new emails every 2 seconds
    const interval = setInterval(() => {
      if (folder === "inbox") {
        dispatch(getInboxMails(userEmail)); // Fetch inbox emails
      } else if (folder === "sent") {
        dispatch(getSentMails(userEmail)); // Fetch sent emails
      }
    }, 2000); // 2 seconds interval

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [folder, dispatch, userEmail]);

  const mails = folder === "inbox" ? inboxEmails : sentEmails;

  return (
    <div>
      {selectedEmail ? (
        // Full email view when an email is selected
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button variant="link" onClick={handleBackToList}>
              <ArrowLeft size={24} /> Back
            </Button>
            <Button
              variant="link"
              onClick={() => handleDeleteEmail(selectedEmail)}
              style={{ color: "red", marginLeft: "auto" }}
              title="Delete Email"
            >
              <Trash size={24} />
            </Button>
          </div>
          <h2>{selectedEmail.subject}</h2>
          <p>
            <strong>From:</strong> {selectedEmail.sender}
          </p>
          <p>
            <strong>To:</strong> {selectedEmail.recipient}
          </p>
          <p>
            <strong>Sent:</strong>{" "}
            {new Date(selectedEmail.sentAt).toLocaleString()}
          </p>
          <hr />
          <p>
            {(() => {
              try {
                const messageData = JSON.parse(selectedEmail.message);
                return messageData.blocks[0]?.text || "No message content";
              } catch (error) {
                console.error("Error parsing full message:", error);
                return "Error parsing message";
              }
            })()}
          </p>
        </div>
      ) : (
        <ListGroup>
          {mails.map((mail, index) => {
            // Parse message if it's JSON formatted
            let messageText = "No message";
            if (mail.message) {
              try {
                const messageData = JSON.parse(mail.message);
                const fullMessage =
                  messageData.blocks[0]?.text || "No message content";
                const words = fullMessage.split(" ");
                const limitedMessage = words.slice(0, 5).join(" ");
                messageText = limitedMessage || "No message content";
              } catch (error) {
                console.error("Error parsing message:", error);
                messageText = "Error parsing message";
              }
            }
            const isSender = mail.sender === userEmail;

            const isUnread =
              folder === "inbox" ? !mail.isReadReceiver : !mail.isReadSender;

            return (
              <ListGroup.Item
                key={mail.id || index}
                onClick={() => handleMessageClick(mail)} // Mark as read on click
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                {isUnread && (
                  <span style={{ color: "blue", marginRight: "8px" }}>♣</span> // Blue dot for unread
                )}
                <strong>From: {mail.sender}</strong>
                <strong>{mail.subject}</strong> - {messageText}
                <small>{formatDate(mail.sentAt)}</small>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};

export default MailList;
