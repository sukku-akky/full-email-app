import { emailActions } from "./redux-store";

export const sendEmail = (emailData) => {
  return async (dispatch) => {
    console.log("Sending email with data:", emailData);

    const sendEmailRequest = async () => {
      const response = await fetch(
        "http://localhost:8000/sendEmail", // Adjust the endpoint as needed
        {
          method: "POST",
          body: JSON.stringify(emailData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to send email";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Email sent successfully:", data);
      // You can dispatch an action here if you need to update the Redux store after sending the email
      // dispatch(emailActions.emailSentSuccess(data)); // Example action
    };

    try {
      await sendEmailRequest();
    } catch (e) {
      alert(e.message);
      console.error("Error sending email:", e);
    }
  };
};

export const getInboxMails = (recipientEmail) => {
  return async (dispatch) => {
    console.log("Fetching inbox emails for:", recipientEmail);

    const fetchInboxMails = async () => {
      const response = await fetch(
        `http://localhost:8000/inbox/${recipientEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Failed to fetch inbox emails";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Fetched inbox emails:", data);
      // You can dispatch an action here to store inbox emails in the Redux store
      // dispatch(emailActions.setInboxEmails(data)); // Example action
      return data;
    };

    try {
      const result = await fetchInboxMails();
      dispatch(emailActions.fetchReceivedEmailsSuccess(result));
    } catch (e) {
      alert(e.message);
      console.error("Error fetching inbox emails:", e);
    }
  };
};

// Function to get sent mails
export const getSentMails = (senderEmail) => {
  return async (dispatch) => {
    try {
      console.log("Fetching sent mails for:", senderEmail);
      const response = await fetch(`http://localhost:8000/sent/${senderEmail}`);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Failed to fetch sent emails";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Sent emails:", data);

      // Dispatch to save sent emails to Redux store
      dispatch(emailActions.fetchSentEmailsSuccess(data));
    } catch (error) {
      console.error("Error fetching sent emails:", error);
    }
  };
};
