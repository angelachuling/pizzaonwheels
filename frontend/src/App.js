import React from 'react';
import {Container} from 'react-bootstrap';
import Header from './components/Header.component';
import Footer from './components/Footer.component';

const App = () => {
  return (
    <>
    <Header />
    <main className='py-3'>
      <Container>
      <h2>Welcome to PizzaOnWheels </h2>
      </Container>
    </main>
    <Footer />
    </>
  );
}

export default App;
