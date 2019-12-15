import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import React from 'react';
import './Genre-View';

import { Link } from 'react-router-dom';

/**
 * Genre information of movie
 * @function GenreView
 * @param {string} props - movie.genre
 * @returns {Container} - information about the genre
 */

function GenreView(props) {
  const { movies, titleName } = props;

  if (!movies || !movies.length) return null;

  const movie = movies.find(movie => movie.title === titleName);
  console.log(movie.genre)
    return (
    
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                      {movie.genre.name}
                    </Card.Title>     
                    <Card.Text>
                      Genre info: {movie.genre.description}
                    </Card.Text>
                    <Link to={`/movies/${movie._id}`}>
                      <Button variant='primary'>Return to Movies</Button>
                    </Link>
                </Card.Body>
            </Card>   
        </Container>
    );
  }

export default connect(({movies}) => ({movies}))(GenreView)

