//imports
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './registration-view.scss';


export function RegistrationView(props) {
  const [username, createUsername] = useState('');
  const [password, createPassword] = useState('');
  const [email, createEmail] = useState('');
  const [birthday, createDob] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, birthday, email);

    // workaround for authentication
    // props.onLoggedIn(username);

    // send a request to the server for authentication
    axios.post('https://myflixdbjcg.herokuapp.com/users', {
      username: username, 
      password: password, 
      birthday: birthday, 
      email: email,
   })
    .then(res => {
      const data = res.data;
      console.log(data);
      alert('Registration has been Successful!');
      window.open('/');
    })
    .catch(e => {
      console.log('Registration Error');
    });
  };

  return (
    <Container className='registrationContainer'>
      <Form className='registrationForm'>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => createEmail(e.target.value)} />
          <Form.Text className='emailShare'>
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId='formBasicUsername'>
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={e => createUsername(e.target.value)} />
          </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Passwordy" value={password} onChange={e => createPassword(e.target.value)} />
        </Form.Group>

        <Form.Group controlId='formBasicDob'>
        <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" placeholder="01/01/1985" value={birthday} onChange={e => createDob(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicChecbox">
          <Form.Check type="checkbox" label="Check if you're a good person" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Register
        </Button>

        <Link to={`/`}>
            <Button id='loginButtonRegistration'>Already Registered?</Button>
          </Link>
      </Form>
    </Container>
  );
}
