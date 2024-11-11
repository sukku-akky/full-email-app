import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialEmailState = {
  sentEmails: [],
  receivedEmails: [],
  selectedEmail:[],
  loading: false,
  error: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState: initialEmailState,
  reducers: {
    sendEmailRequest(state) {
      state.loading = true;
    },
    sendEmailSuccess(state, action) {
      state.loading = false;
      state.sentEmails.push(action.payload); // Assuming payload is the sent email object
    },
    sendEmailFailure(state, action) {
      state.loading = false;
      state.error = action.payload; // Error message
    },
    fetchSentEmailsSuccess(state, action) {
      state.sentEmails = action.payload.filter(email=>!email.deletedBySender); // Assuming payload is an array of sent emails
    },
    fetchReceivedEmailsSuccess(state, action) {
      state.receivedEmails = action.payload.filter(email=>!email.deletedByRecipient) // Assuming payload is an array of received emails
    },
    deleteEmailSuccess(state, action) {
      const { emailId, isSender } = action.payload; // Email ID and whether it was sent or received
      if (isSender) {
        state.sentEmails = state.sentEmails.filter(
          email => email._id !== emailId
        );
      } else {
        state.receivedEmails = state.receivedEmails.filter(
          email => email._id !== emailId
        );
      }
    },
    setSelectedEmail(state,action){
      state.selectedEmail=action.payload;

    },
    markEmailAsReadSuccess(state, action) {
      const { emailId ,isSender} = action.payload;
      if (isSender) {
        // Update sender's read status
        state.sentEmails = state.sentEmails.map(email =>
          email._id === emailId ? { ...email, isReadSender: true } : email
        );
      } else {
        // Update receiver's read status
        state.receivedEmails = state.receivedEmails.map(email =>
          email._id === emailId ? { ...email, isReadReceiver: true } : email
        );
      }
    },
    clearEmailError(state) {
      state.error = null;
    },
  },
});

const initialAuthState = {
  token: localStorage.getItem("token") || "",
  isLoggedIn: !!localStorage.getItem("token"),
  email: localStorage.getItem("email"),
  fullName: "",
  photoUrl: "",
  emailVerified: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      const { token, email } = action.payload;
      // Save token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      // Update state with token and email
      state.token = token;
      state.email = email;
      state.isLoggedIn = !!token;
    },
    logout(state) {
      // Remove token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      // Reset the state
      state.token = "";
      state.email = "";
      state.isLoggedIn = false;
      state.fullName = "";
      state.photoUrl = "";
    },
    setFullNameHandler(state, action) {
      state.fullName = action.payload;
    },
    setUrlHandler(state, action) {
      state.photoUrl = action.payload;
    },
    setEmailVerified(state, action) {
      state.emailVerified = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    email: emailSlice.reducer,
  },
});

export const emailActions = emailSlice.actions;
export const authActions = authSlice.actions;
export default store;
