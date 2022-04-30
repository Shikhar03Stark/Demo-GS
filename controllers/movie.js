import Movie from "../models/Movie.js";
import User from "../models/User.js";

const controllers = {
    average_rating: async (req, res, next) => {
        try {
            const movie_id = req.params.movie_id;
            if(!movie_id){
                next({
                    status: 400,
                    error: `Movie ID can not be empty parameter`,
                });
                return;
            }

            const movie = await Movie.findOne({id: movie_id});

            if(!movie){
                next({
                    status: 400,
                    error: `Movie does not exist`,
                });
                return;
            }

            const avg_rating = movie.average_rating;

            res.status(200).json({
                ok: true,
                data: {
                    movie_id: movie_id,
                    rating: avg_rating,
                }
            });
            return;
            
        } catch (error) {
            console.error(error);
            next({
                status: 500,
                error: `Internal server error`,
            })
        }
    },

    get_all: async (req, res, next) => {
        try {
            const limit = 20;
            let page = 1;
            if(req.query.page){
                page = parseInt(req.query.page);
            }

            const movies = await Movie.find({}).skip((page-1)*limit).limit(limit).exec();
            const result = [];
            for(let movie of movies){
                result.push(Object.assign({}, {
                    id: movie.id,
                    genre_ids: movie.genre_ids,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    rating: movie.average_rating,
                }));
            }

            res.status(200).json({
                ok: true,
                data: {
                    movies: result,
                }
            });

            
        } catch (error) {
            console.error(error);
            next({
                status: 500,
                error: 'Internal server error',
            });
        }
    },

    rate_movie: async (req, res, next) => {
        try {
            const movie_id = req.params.movie_id;
            const rating = parseInt(req.params.rating);

            if(rating <= 0 || rating > 5){
                next({
                    status: 400,
                    error: `Rating can only be in between 1 to 5`,
                });
                return;
            }

            const movie = await Movie.findOne({id: movie_id});
            if(!movie){
                next({
                    status: 400,
                    error: `Movie does not exists`,
                });
                return;
            }

            await req.user.rate_movie(movie_id, rating);

            const up_user = await User.findOne({id: req.user.id});

            res.status(200).json({
                ok: true,
                data: {
                    movies_rated: req.user.movies_rated,
                }
            });
            
        } catch (error) {
            console.error(error);
            next({
                status: 500,
                error: error.message || `Internal server error`,
            });
        }

    },
}

export default controllers;