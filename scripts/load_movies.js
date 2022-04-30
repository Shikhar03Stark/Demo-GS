import fs from 'node:fs';
import {program} from 'commander';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
dotenv.config({
    path: '../.env',
});

const credentials = {
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'default',
};

program
    .description(`This script reads stdin for JSON array of movies and upload entries to database.`)
    .option('-u, --url <url>', 'sets the database connection url', 'null')
program.parse();

const options = program.opts();

let database_url = credentials.url;
if(options.url === 'null'){
    if(!credentials.url){
        database_url = `mongodb+srv://${credentials.username}:${credentials.password}@demo-cluster.fyw1e.mongodb.net/${credentials.database}?retryWrites=true&w=majority`;
    }
}
else{
    database_url = options.url;
}

await mongoose.connect(database_url);
const db_handle = mongoose.connection;
db_handle.on('open', () => {
    console.log(`Connected to database`);
});

db_handle.on('error', (err) => {
    console.error(`Error connecting to database`);
    console.error(err);
    process.exit(1);
});

try{
    const json_data = JSON.parse(fs.readFileSync(process.stdin.fd).toString());

    console.log('Upserting...');
    for(let movie of json_data){
        await Movie.findOneAndUpdate({id: movie.id}, {
            id: movie.id,
            genre_ids: movie.genre_ids,
            title: movie.title,
            orignal_language: movie.orignal_language,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            rate_sum: 0,
            rate_count: 0,
        }, {upsert: true});
    }
    console.log('Upsertion complete');
    fs.closeSync(process.stdout.fd);
    process.exit(0);

} catch (error) {
    console.error('Error parsing or connecting to database');
    console.error(error);
    process.exit(1);
}
