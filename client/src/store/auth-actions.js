import { authActions } from "./redux-store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const logIntoDatabase = (formData) => {
    return async (dispatch) => {
      const sendLoginRequest = async () => {
        const response = await fetch(
          "http://localhost:8000/login",
          {
            method: "POST",
            body: JSON.stringify({
              ...formData,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const error=await response.json();
          const errorMessage=error.message;

          throw new Error(errorMessage);
        }
        const data = await response.json();
        console.log(data);
        dispatch(
          authActions.login({ email: formData.email, token: data.token })
        );
      };
      try {
        const result = await sendLoginRequest();
      } catch (e) {
        console.log(e.message);
      }
    };
  };

 
  
  export const signUptoDatabase = (formData) => {
    return async (dispatch) => {
      console.log("Sending request with data:", formData);
      const sendSignUpRequest = async () => {
        const response = await fetch(
          "http://localhost:8000/signup",
          {
            method: "POST",
            body: JSON.stringify({
              ...formData,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json(); // Log the error response
         
          const errorMessage=errorData.message;
          throw new Error(errorMessage || "Failed to sign up");
        }
        
        const data = await response.json();
        console.log(data)
        dispatch(
          authActions.login({ email: formData.email, token: data.idToken })
        );
      };
      try {
        const result = await sendSignUpRequest();
      } catch (e) {
        alert(e.message);
      }
    };
  };
  