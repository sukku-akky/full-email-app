import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Main.js/Header';
import Sidebar from '../components/Main.js/SideBar';
import MailList from '../components/Main.js/MailList';

const MainPage = () => {
  const [folder, setFolder] = useState('inbox');

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          <Col md={3}>
            <Sidebar onFolderSelect={setFolder} />
          </Col>
          <Col md={9}>
            <h3>{folder.charAt(0).toUpperCase() + folder.slice(1)}</h3>
            <MailList folder={folder} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MainPage;
