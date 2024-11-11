import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { authActions } from "../../store/redux-store";
import { useSelector, useDispatch } from "react-redux";
const Sidebar = ({ onFolderSelect }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inboxEmails = useSelector((state) => state.email.receivedEmails) || [];
  const unreadCount = inboxEmails.filter(
    (email) => !email.isReadReceiver
  ).length;
  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  return (
    <div
      style={{ width: "250px", backgroundColor: "#f8f9fa", padding: "1rem" }}
    >
      <ListGroup>
        <Button variant="primary" as={Link} to="/compose">
          Compose
        </Button>
        <ListGroup.Item action onClick={() => onFolderSelect("inbox")}>
          Inbox
          {unreadCount > 0 && (
            <span
              style={{ marginLeft: "10px", color: "red", fontWeight: "bold" }}
            >
              ({unreadCount})
            </span>
          )}
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => onFolderSelect("sent")}>
          Sent
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => onFolderSelect("drafts")}>
          Drafts
        </ListGroup.Item>
      </ListGroup>
      <Button variant="danger" onClick={logoutHandler} className="mt-3">
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
