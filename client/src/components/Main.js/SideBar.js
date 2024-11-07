import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext,useEffect } from 'react';
import {Link} from 'react-router-dom';
import { authActions } from '../../store/redux-store';
import { useSelector,useDispatch } from 'react-redux';
const Sidebar = ({ onFolderSelect }) => {
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const logoutHandler=()=>{
    dispatch(authActions.logout());
    navigate("/")
  }

  return (
    <div style={{ width: '250px', backgroundColor: '#f8f9fa', padding: '1rem' }}>
      <ListGroup>
        <Button variant="primary" as={Link} to="/compose">
            Compose
        </Button>
        <ListGroup.Item action onClick={() => onFolderSelect('inbox')}>Inbox</ListGroup.Item>
        <ListGroup.Item action onClick={() => onFolderSelect('sent')}>Sent</ListGroup.Item>
        <ListGroup.Item action onClick={() => onFolderSelect('drafts')}>Drafts</ListGroup.Item>
      </ListGroup>
      <Button variant="danger" onClick={logoutHandler} className="mt-3">Logout</Button>
    </div>
  );
};

export default Sidebar;
