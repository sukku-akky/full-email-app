import React from 'react';
import { Navbar, Form, FormControl, Button, Container, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa'; // Importing search icon

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Navbar bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand>Mailbox</Navbar.Brand>
        <InputGroup className="me-2" style={{ flexGrow: 1 }}>
          <InputGroup.Text>
            <FaSearch /> {/* Search icon */}
          </InputGroup.Text>
          <FormControl
            className='search-bar'
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={{ height: '50px' }} // Adjust height for a bigger search bar
          />
        </InputGroup>
      </Container>
    </Navbar>
  );
};

export default Header;
