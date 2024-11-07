import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { getInboxMails, getSentMails } from "../../store/email-actions";
import { useDispatch, useSelector } from "react-redux";
//import { getMails } from '../services/mailService'; // Assume this fetches data from Firebase

const MailList = ({ folder }) => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.email);
  const inboxEmails = useSelector((state) => state.email.receivedEmails) || [];
  const sentEmails = useSelector((state) => state.email.sentEmails) || [];

  useEffect(() => {
    if (folder === "inbox") {
      dispatch(getInboxMails(userEmail));
    } else if (folder === "sent") {
      dispatch(getSentMails(userEmail));
    }
  }, [folder, dispatch, userEmail]);

  const mails = folder === "inbox" ? inboxEmails : sentEmails;

  return (
    <ListGroup>
      {mails.map((mail, index) => {
        // Parse message if it's JSON formatted
        let messageText = "No message";
        if (mail.message) {
          try {
            const messageData = JSON.parse(mail.message);
            messageText = messageData.blocks[0]?.text || "No message content";
          } catch (error) {
            console.error("Error parsing message:", error);
            messageText = "Error parsing message";
          }
        }

        return (
          <ListGroup.Item key={mail.id || index}>
            <strong>{mail.subject}</strong> - {mail.snippet}
            <p>{messageText}</p> {/* Render message content */}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default MailList;
