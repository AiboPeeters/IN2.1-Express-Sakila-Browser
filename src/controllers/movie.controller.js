const movieService = require("../services/movie.service");
const logger = require("../util/logger");

const TAG = "movie.controller";

function buildPagination(page, totalPages) {
    let pageLinks = [];
    let lastLink = 0;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
            if (i - lastLink > 1) {
                pageLinks.push({ type: "ellipsis" });
            }
            pageLinks.push({
                type: "page",
                number: i,
                active: i === page
            });
            lastLink = i;
        }
    }

    return {
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        pageLinks
    };
}

function getAllMovies(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    movieService.getMovies(page, limit, (movies, totalCount) => {
        const totalPages = Math.ceil(totalCount / limit);
        const pagination = buildPagination(page, totalPages);

        logger.debug(`${TAG} Rendering movies page ${page} of ${totalPages}`);

        res.render("movies", {
            title: "Beschikbare Films",
            movies,
            page,
            limit,
            totalPages,
            pagination
        });
    });
}

function getMovieDetailsById(req, res, next) {
    const id = req.params.id;

    movieService.getMovieById(id, (movie) => {
        if (!movie) {
            logger.warn(`${TAG} Movie with id ${id} not found`);
            return res.status(404).send("Film niet gevonden");
        }

        logger.debug(`${TAG} Rendering details for movie id ${id}`);
        res.render("movieDetails", {
            title: "Film Details",
            movieDetails: movie
        });
    });
}

function getEditMovie(req, res, next) {
    if (!req.session.user) return res.redirect("/auth/login");

    const id = req.params.id;

    movieService.getMovieById(id, (movie) => {
        if (!movie) return res.status(404).send("Film niet gevonden");

        movieService.getAllLanguages((err, languages) => {
            if (err) {
                logger.error(`${TAG} Error fetching languages: ${err}`);
                return next(err);
            }

            logger.debug(`${TAG} Rendering edit page for movie id ${id}`);
            res.render("movieEdit", {
                title: "Edit Film",
                movie,
                languages
            });
        });
    });
}

function postEditMovie(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    const id = req.params.id;

    movieService.getMovieById(id, (movie) => {
        if (!movie) return res.status(404).send("Film niet gevonden");

        const updatedMovie = {
            title: req.body.title || movie.title,
            description: req.body.description || movie.description,
            release_year: req.body.release_year || movie.release_year,
            language_id: req.body.language_id || movie.language_id,
            rental_duration: req.body.rental_duration || movie.rental_duration,
            rental_rate: req.body.rental_rate || movie.rental_rate,
            replacement_cost: req.body.replacement_cost || movie.replacement_cost,
            length: req.body.length || movie.length,
            rating: req.body.rating || movie.rating,
            image: req.body.image || movie.image,
        };

        movieService.updateMovie(id, updatedMovie, (err) => {
            if (err) {
                logger.error(`${TAG} Error updating movie id ${id}: ${err}`);
                return next(err);
            }
            logger.info(`${TAG} Movie id ${id} updated`);
            res.redirect(`/movies/${id}`);
        });
    });
}

function deleteMovie(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    const id = req.params.id;

    movieService.deleteMovie(id, (err) => {
        if (err) {
            logger.error(`${TAG} Error deleting movie id ${id}: ${err}`);
            return next(err);
        }
        logger.info(`${TAG} Movie id ${id} deleted`);
        res.redirect("/movies");
    });
}

function getCreateMovie(req, res, next) {
    if (!req.session.user) return res.redirect("/auth/login");

    movieService.getAllLanguages((err, languages) => {
        if (err) {
            logger.error(`${TAG} Error fetching languages: ${err}`);
            return next(err);
        }
        logger.debug(`${TAG} Rendering create movie page`);
        res.render("movieCreate", {
            title: "Nieuwe Film Toevoegen",
            languages
        });
    });
}

function postCreateMovie(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    const newMovie = {
        title: req.body.title,
        description: req.body.description,
        release_year: req.body.release_year,
        language_id: req.body.language_id,
        rental_duration: req.body.rental_duration,
        rental_rate: req.body.rental_rate,
        replacement_cost: req.body.replacement_cost,
        length: req.body.length,
        rating: req.body.rating,
        image: req.body.image
    };

    movieService.createMovie(newMovie, (err, result) => {
        if (err) {
            logger.error(`${TAG} Error creating movie: ${err}`);
            return next(err);
        }
        logger.info(`${TAG} Movie created with id ${result.film_id}`);
        res.redirect("/movies");
    });
}

module.exports = { getAllMovies, getMovieDetailsById, getEditMovie, postEditMovie, deleteMovie, getCreateMovie, postCreateMovie };

