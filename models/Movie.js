import mongoose from "mongoose";

const movie_schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    genre_ids: {
        type: [String],
        required: false,
    },
    title: {
        type: String,
        required: true,
        index: true,
    },
    original_language: {
        type: String,
        required: false,
    },
    overview: {
        type: String,
        required: false,
        index: true,
    },
    poster_path: {
        type: String,
        required: false,
    },
    release_date: {
        type: Date,
        required: false,
    },
    rate_sum: {
        type: Number,
        required: true,
        default: 0,
    },
    rate_count: {
        type: Number,
        required: true,
        default: 0,
    },

});

movie_schema.method('rate', function(rating){
    if(rating > 0 && rating <= 5){
        this.rate_sum += rating;
        this.rate_count += 1;
    }
    else{
        throw Error('Rating can only be between 1 to 5');
    }
});

movie_schema.virtual('average_rating').get(function(){
    return this.rate_sum/this.rate_count;
});

const Movie = mongoose.model('Movie', movie_schema);

export default Movie;