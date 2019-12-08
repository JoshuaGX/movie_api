import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export class MovieCard extends React.Component {
    render() {
        // This is given to the <MovieCard/> component by the outer world
        // which, in this case, is `MainView`, as `MainView` is what’s
        // connected to your database via the movies endpoint of your API
        const { movie, onClick } = this.props;

        return (
            <div className="col-10 col-lg-3 ml-5 mt-5">
                <Card style={{ width: "16rem" }}>
                    <Card.Img variant="top" src="http://via.placeholder.com/640x360" />
                    <Card.Body>
                        <Card.Title>{movie.Title}</Card.Title>
                        <Card.Text>{movie.Description}</Card.Text>
                        <Button
                            className="btn btn-outline-primary text-uppercase"
                            onClick={() => onClick(movie)}
                            variant="link"
                        >
                            More Info
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequire,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};