import axios from 'axios'; 
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import React from 'react';
import { Link } from 'react-router-dom';
import './Profile-View.scss';

class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            email: null,
            birthday: null,
            favoriteMovies: [],
            movies: [],
        };
    }

    componentDidMount() {
      const accessToken = localStorage.getItem('token');
      this.getUser(accessToken);
    }

    /**
     * gets user information for display and sets the state with it.
     * @param {number} token 
     * @return {object} user information
     */
    getUser(token) {
        const username = localStorage.getItem('user');
        axios.get(`https://myflixdbjcg.herokuapp.com/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` } 
        })
        .then(res => {
          this.setState({
            username: res.data.username,
            password: res.data.password,
            email: res.data.email,
            birthday: res.data.birthday,
            favoriteMovies: res.data.favoriteMovies,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      }
      
      /**
       * removes favorite movie from list
       * @param {number} movieId
       * @return {alert} removed id from favorite list
       */
   deleteFavoriteMovie(movieId) {
      console.log(this.props.movies);
        // send a request to the server for authentication
        axios.delete(`https://myflixdbjcg.herokuapp.com/users/${localStorage.getItem('user')}/favoriteMovies/${movieId}`, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
          alert('removed movie from favorites');
        })
        .catch(e => {
          alert('error removing movie' + e);
        });
      }

      /**
       * deletes user and user information from database
       * @param {event} deleteAccount
       * @return {alert} removed account
       */
      deleteUser(e) {
        axios.delete(`https://myflixdbjcg.herokuapp.com/users/${localStorage.getItem('user')}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
          alert('Account deleted');
          localStorage.removeItem('token', 'user');
          window.open('/');
        })
        .catch(event => {
          alert('failed to delete user');
        });
      }

    render() {
    
      const favoriteMovieList = this.props.movies.filter(m => this.state.favoriteMovies.includes(m._id));
 
      return (
        <div>
              <Container>
                <Col>
                  <Card>
                      <Card.Body>
                      <Card.Title>{this.state.username}</Card.Title>
                      <Card.Text>Email: {this.state.email}</Card.Text>
                      <Card.Text>Birthday {this.state.birthday}</Card.Text>
                        Favorite Movies:
                        { favoriteMovieList.map(m => (
                        <div key={m._id} className='fav-movies-button'>
                        <Link  to={`/movies/${m._id}`}>
                        <Button variant="link">{m.title}</Button>
                        </Link>
                        <Button size='sm' onClick={e => this.deleteFavoriteMovie(m._id)}>Remove Favorite</Button>
                        </div>
                      ))
                      }
                      <Link to={`/`}>
                          <Button variant='primary'>Return</Button>
                      </Link>
                      <Link to={'/user/update'}>
                          <Button variant='primary'>Update ALL your profile.</Button>
                      </Link>
                      <Button onClick={() => this.deleteUser()}>Delete account</Button>
                      </Card.Body>
                  </Card>   
                  
                </Col>
              </Container>
            </div>
        );
    }
}

export default connect(({ movies, users }) => ({ movies, users }) )(ProfileView);
