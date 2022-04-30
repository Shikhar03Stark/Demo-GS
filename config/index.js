import mongoose from "mongoose";

const connect = async () => {
    const credentials = {
        url: process.env.DB_URL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'default',
    };
    let connection_url = credentials.url;
    if(!credentials.url){
        connection_url = `mongodb+srv://${credentials.username}:${credentials.password}@demo-cluster.fyw1e.mongodb.net/${credentials.database}?retryWrites=true&w=majority`;
    }
    await mongoose.connect(connection_url);
    const db_handle = mongoose.connection;
    db_handle.on('open', () => {
        (process.env.NODE_ENV==='development')?console.log('Connected to Database successfully'):null;
    });
    
    db_handle.on('error', (err) => {
        (process.env.NODE_ENV==='development')?console.log(`Connected to Database successfully\n${err}`):null;
    });
}

export default connect;