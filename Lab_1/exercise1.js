'use strict'
const dayjs = require('dayjs');

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
}


let f1 = new Film(1,'Pulp Fiction',true,dayjs('2022-03-10'),5);
let f4 = new Film(4,'Matrix',false);
let f3 = new Film(3,'Star Wars',false);
let f2 = new Film(2,'21 Grams',true,dayjs('2022-03-17'),4)
let f5 = new Film(5,'Shrek',false,dayjs('2022-03-21'),3)
let library = new FilmLibrary();
library.addNewFilm(f1);
library.addNewFilm(f2);
library.addNewFilm(f3);
library.addNewFilm(f4);
library.addNewFilm(f5);

console.log(library.getRated());
