import './App.css';
import Main from './views/main';
import {Container, Row,Col, Form, Button,Input} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app">
      <Container >
        <Main/>
      </Container>
    </div>
  );
}

export default App;
