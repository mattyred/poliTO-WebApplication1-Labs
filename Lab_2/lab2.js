'use strict';
const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Film(id, title, favorite = false, date = undefined, rating = undefined){ // Constructor function
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.date = date;
    this.rating = rating;

    this.toString = () => {
        return this.id + ' ' + this.title + ' ' + this.favorite + ' ' + this.date + ' ' + this.rating;
    }
}

function FilmLibrary(){

    this.filmLibrary = [];
    /*
     * Adds a new film passed as parameter
    */
    this.addNewFilm = (film) => {
        this.filmLibrary.push(film);
    };

    this.sortByDate = () => {
        let sortedFilmLibrary = [...this.filmLibrary].sort((f1,f2) => {
            // f1 > f2 : -1
            // f1 < f2 : 1
            // f1===f2 : 0
            if(f1.date === undefined){ 
                return 1;
            }else if(f2.date === undefined){
                return -1;
            }else{
                if(f1.date.isSame(f2.date)){
                    return 0;
                }else return f2.date.isAfter(f1.date)? -1:1;
            }
        });
        return sortedFilmLibrary;
    };

    this.deleteFilm = (id) => {
        for(let i=0; i<this.filmLibrary.length; i++){
            if(this.filmLibrary[i].id === id){
                this.filmLibrary.splice(i, 1); // delete one element at index i
            }
        }
    }

    this.resetWatchedFilms = () => {
        this.filmLibrary.forEach(f => f.date = undefined);
    }

    this.getRated = () => {
        [...this.filmLibrary].filter(f => f.rating != undefined)
                             .sort((f1,f2) => f2.rating - f1.rating)
                             .map(f => console.log(f.toString()));
    }

    /*
    * Methods of the LAB2
    */
    this.getFilmsFromDB = (db) => {        
        return new Promise((resolve,reject) => {
            const query = 'SELECT * FROM films';
            db.all(query, [], (err,rows) => {
                if(!err){
                    const filmArray = rows.map(row => {
                        return new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                    });
                    // filmArray.forEach(f => console.log(f));
                    resolve(filmArray);
                }else{
                    console.log("There was an error in the query");
                }
            });
        });
    };

    this.getFavouriteFilms = (db) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE favorite = 1';
            db.all(query, [], (err,rows) => {
                if(!err){
                    const favouriteFilmArray = rows.map(row => {
                        return new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                    });
                    // filmArray.forEach(f => console.log(f));
                    resolve(favouriteFilmArray);
                }else{
                    console.log("There was an error in the query");
                }
            });
        });
    }

    this.getTodayWatchedFilms = (db) => {
        return new Promise((resolve,reject) => {
            const today = dayjs(undefined).format('YYYY-MM-DD');
            const query = 'SELECT * FROM films WHERE watchdate = DATE(?)';
            db.all(query, [today], (err,rows) => {
                if(!err){
                    resolve(rows.map(row => {
                        return new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                    }));
                }else{
                    console.log("There was an error in the query");
                }
            })
        });
    };

    this.getFilmsWatchedBeforeDate = (db, datex) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM films WHERE (watchdate < DATE(?))';
            db.all(query, [datex], (err,rows) => {
                if(!err){
                    resolve(rows.map(row => {
                        return new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                    }));
                }else{
                    console.log("There was an error in the query");
                }
            });
        });
    };

    this.getFilmsOverRating = (db,ratingx) => {
        return new Promise((resolve,reject) => {
            const query = 'SELECT * FROM films WHERE rating > ?';
            db.all(query, [ratingx], (err,rows) => {
                if(!err){
                    resolve(rows.map(row => {
                        return new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                    }));
                }else{
                    console.log("There was an error in the query");
                }
            });
        });
    };

    this.getFilmByTitle = (db, titlex) => {
        return new Promise((resolve,reject) => {
        const query = 'SELECT * FROM films WHERE title = ?';
            db.all(query, [titlex], (err,rows) => {
                if(!err){
                    resolve(rows.map(row => {
                        return new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                    }));
                }else{
                    console.log("There was an error in the query");
                }
            });
        });
    };

    this.storeNewMovie = (db, movie) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO films(id,title,favorite,watchdate,rating) VALUES(?,?,?,?,?)';
            db.run(query, [movie.id, movie.title, movie.favorite, movie.date, movie.rating], (err) => {
                if(err){
                    throw err;
                }else{
                    resolve(true);
                }
            });
        });
    };

    this.removeFilmById = (db, movieId) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM films WHERE id = ?';
            db.run(query, [movieId], (err) => {
                if(err){
                    throw err;
                }else{
                    resolve(true);
                }
            });
        });
    };

    this.removeAllDates = (db) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE films SET watchdate = NULL';
            db.run(query, [], (err) => {
                if(err){
                    throw err;
                }else{
                    resolve(true);
                }
            });
        });
    };
}


let library = new FilmLibrary();

// Initialize the DB
const db = new sqlite.Database('films.db', err => {
    if(err) console.log("There was an error in opening the DB");
});

// Get all the films from the DB and return an array
let filmsArray = [];
library.getFilmsFromDB(db).then(result => {
    filmsArray = Array.of(result);
    //filmsArray.forEach(f => console.log(f));
});

let favouriteFilmsArray = [];
// Get all the favourite films
library.getFavouriteFilms(db).then(result => {
    favouriteFilmsArray = Array.of(result);
    //favouriteFilmsArray.forEach(f => console.log(f.toString()));
});

// Get all the films watched today
let todayWatchedFilms = [];
library.getTodayWatchedFilms(db).then(result => {
    todayWatchedFilms = Array.of(result);
    //todayWatchedFilms.forEach(f => console.log(f.toString()));
});

// Get films watched before a given date
const datex = dayjs('2022-03-21').format('YYYY-MM-DD');
let filmsWatchedBeforeDate = [];
library.getFilmsWatchedBeforeDate(db, datex).then(result => {
    filmsWatchedBeforeDate = Array.of(result);
    //filmsWatchedBeforeDate.forEach(f => console.log(f.toString()));
})

// Get all the films with a rating greater than a given one
const ratingx = 3;
let filmsOverRating = [];
library.getFilmsOverRating(db, ratingx).then(result => {
    filmsOverRating = Array.of(result);
    //filmsOverRating.forEach(f => console.log(f.toString()));
});

// Get all the films with a given title
const titlex = 'Matrix';
let filmsWithTitle = [];
library.getFilmByTitle(db, titlex).then(result => {
    filmsWithTitle = Array.of(result);
    //filmsWithTitle.forEach(f => console.log(f.toString()));
});

// Part 2

// Initialize the copy of the DB
const db_copy = new sqlite.Database('films_copy.db', err => {
    if(err) console.log("There was an error in opening the DB");
});

// Insert a movie in the copy of films.db
const newFilm = new Film('7', 'ExampleTitle', 1, dayjs('2022-03-19').format('YYYY-MM-DD'), 3);
/*
library.storeNewMovie(db_copy, newFilm).then(result => {
    if(result){
        console.log(`${newFilm.toString()} added to the db`);
    }
});
*/
// Delete a movie from the copy of films.db
const filmToRemove = 1;
library.removeFilmById(db_copy, filmToRemove).then(result => {
    if(result){
        console.log(`Film with id ${filmToRemove} has been succesfully removed`);
    }
});

// Delete the watch date of all the films in the copy of films.db
library.removeAllDates(db_copy).then(result => {
    if(result){
        console.log('Dates have been removed');
    }
});
