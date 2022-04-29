import mongoose from "mongoose";
import Movie from "./Movie.js";

const movie_rating = {
    id: String,
    rate: Number,
    last_updated: Date,
}

const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    movies_rated: {
        type: [movie_rating],
        required: false,
        index: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    status: {
        type: String, //['verified', 'pending', 'suspended']
        required: true,
        default: 'verified',
    },
});

user_schema.method('rate_movie', async function(movie_id, rating){
    let already_rated = false;
    for(let movie of this.movies_rated){
        if(movie_id === movie.id){
            //update rating
            const movie_obj = await Movie.findOne({id: movie_id});
            movie_obj.rerate(rating, movie.rating);

            movie.rating = rating;
            movie.last_updated = Date.now();
            
            already_rated = true;

            break;
        }
    }

    if(!already_rated){
        const movie = await Movie.findOne({id: movie_id});
        if(movie){
            movie.rate(rating);
            this.movies_rated.push({
                id: movie_id,
                rating: rating,
                last_updated: Date.now(),
            });
        }
        else{
            throw Error('Movie does not exist');
        }
    }

});

// TODO: unrate method

const User = mongoose.model('User', user_schema);

export default User;

