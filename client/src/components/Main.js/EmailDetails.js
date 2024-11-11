import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleEmail } from "../../store/email-actions"; // Action to fetch a single email

const EmailDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.email.currentEmail); // Selector for single email

  useEffect(() => {
    dispatch(getSingleEmail(id)); // Fetch the email based on ID
  }, [dispatch, id]);

  if (!email) {
    return <p>Loading email...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{email.subject}</h2>
      <p><strong>From:</strong> {email.sender}</p>
      <p><strong>To:</strong> {email.receiver}</p>
      <p><strong>Sent:</strong> {new Date(email.sentAt).toLocaleString()}</p>
      <hr />
      <p>{email.message}</p>
    </div>
  );
};

export default EmailDetail;
