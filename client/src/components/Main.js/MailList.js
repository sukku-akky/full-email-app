import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import {
  getInboxMails,
  getSentMails,
  markEmailAsRead,
} from "../../store/email-actions";
import { useDispatch, useSelector } from "react-redux";
//import { getMails } from '../services/mailService'; // Assume this fetches data from Firebase

const MailList = ({ folder }) => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.email);
  const inboxEmails = useSelector((state) => state.email.receivedEmails) || [];
  const sentEmails = useSelector((state) => state.email.sentEmails) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the date format as needed
  };

  const handleMarkAsRead = (emailId, isSender) => {
    dispatch(markEmailAsRead(emailId, isSender));
  };

  useEffect(() => {
    if (folder === "inbox") {
      dispatch(getInboxMails(userEmail));
    } else if (folder === "sent") {
      dispatch(getSentMails(userEmail));
    }
  }, [folder, dispatch, userEmail, sentEmails, inboxEmails]);

  const mails = folder === "inbox" ? inboxEmails : sentEmails;

  return (
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
            onClick={() => handleMarkAsRead(mail._id, isSender)} // Mark as read on click
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
  );
};

export default MailList;
