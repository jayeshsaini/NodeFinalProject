var mongoose = require('mongoose');
var Movies = require('./models/movies');

async function initialize(url) {
    try {
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));    
        return true;
        
    } catch (error) {
        return console.log(error)
    }
}

async function addNewMovie(data) {
    var createMovie = await Movies.create(data);
    console.log(createMovie);
    var allMovies = Movies.find({title: data.title}).lean().exec();
    return allMovies;
}

async function getAllMovies(page, perPage, title) {

    try {
        const limit = perPage;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        var totalDocs = await Movies.countDocuments().exec();

        if (endIndex < totalDocs) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        var movie = Movies.find();

        if (title) {
            movie = Movies.find({ "title": { $regex: title, $options: 'i' } })
        }
        // console.log(movie);
        results.results = await movie.sort('_id').limit(limit).skip(startIndex).lean().exec();
        console.log(results);
        return [results, totalDocs];
        
        
    } catch (error) {
        console.log(error);
    }

}

async function getMovieById(Id) {
    try{
        var movieData = await Movies.findById(id);
        console.log(movieData);
        return movieData; 
    }catch(error){
        return console.error(error);
    }
}

async function updateMovieById(data, Id) {
    try {
        await Movies.findByIdAndUpdate(Id, data);
        return Movies.findById(Id);
    } catch (error) {
        console.log(error);
    }
}

async function deleteMovieById(Id) {
    try {
        await Movies.findByIdAndDelete(Id);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    initialize,
    addNewMovie,
    getAllMovies,
    getMovieById,
    updateMovieById,
    deleteMovieById
};