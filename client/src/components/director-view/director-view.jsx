import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import React from 'react';
import { Link } from 'react-router-dom';

import './Director-View';

/**
 * Director information view
 * @function DirectorView
 * @param {string} props - movie.director.name props
 * @returns {DirectorView}
 */

function DirectorView(props) {
  const { movies, directorName } = props;

  if (!movies || !movies.length) return null;

  const director = movies.find(movie => movie.director.name === directorName).director;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Text>{director.name}</Card.Text>
          <Card.Text>Bio: {director.bio}</Card.Text>
          <Card.Text>Birth: {director.birth}</Card.Text>
          
          <Link to={'/'}>
            <Button variant="primary" type="button">
            Return to Movies
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default connect(({movies}) => ({movies}))(DirectorView);
