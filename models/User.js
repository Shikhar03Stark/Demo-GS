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

user_schema.virtual('rated_movies', function(){
    return this.movies_rated;
})

user_schema.method('rate_movie', async function(movie_id, rating){
    try {
        let already_rated = false;
        for(let movie of this.movies_rated){
            if(movie_id === movie.id){
                //update rating
                const movie_obj = await Movie.findOne({id: movie_id});
                movie_obj.rerate(rating, parseInt(movie.rate));
    
                movie.rate = rating;
                movie.last_updated = Date.now();
                
                already_rated = true;
    
                await this.save();
                break;
            }
        }
    
        if(!already_rated){
            const movie = await Movie.findOne({id: movie_id});
            if(movie){
                movie.rate(rating);
                this.movies_rated.push({
                    id: movie_id,
                    rate: rating,
                    last_updated: Date.now(),
                });
                await this.save();

            }
            else{
                throw Error('Movie does not exist');
            }
            // movie.save();
        }

        return this.movies_rated;
        
    } catch (error) {
        throw error;
    }

});

// TODO: unrate method

const User = mongoose.model('User', user_schema);

export default User;

