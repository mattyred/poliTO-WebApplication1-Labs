'use strict'

function Film(id, title, favorite = false, date = undefined, rating = undefined){ // Constructor function
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.date = (date===undefined? undefined:dayjs(date).format('YYYY-MM-DD'));
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
        return [...this.filmLibrary].filter(f => f.rating != undefined)
                             .sort((f1,f2) => f1.rating - f2.rating);
    }

    this.getAllFilms = () => {
        return this.filmLibrary;
    }

    this.getFavouriteFilms = () => {
        return this.filmLibrary.filter(f => f.favorite === true);
    }

    this.getBestRatedFilms = () => {
        return this.filmLibrary.filter(f => f.rating === 5);
    }

    this.getSeenLastMonthFilms = () => {
        return this.filmLibrary.filter(f => f.date !== undefined)
                               .filter(f => {
                                   let lastInRangeDate = dayjs().subtract(30, 'days');
                                   if(dayjs(f.date).isAfter(lastInRangeDate)){
                                       return true;
                                   }else return false;
                               })
    }
}


function populateLibrary(library){
    let f1 = new Film(1,'Pulp Fiction',true,dayjs('2022-03-10'),5);
    let f4 = new Film(4,'Matrix',false);
    let f3 = new Film(3,'Star Wars',false);
    let f2 = new Film(2,'21 Grams',true,dayjs('2022-03-17'),4)
    let f5 = new Film(5,'Shrek',false,dayjs('2022-03-21'),3)
    library.addNewFilm(f1);
    library.addNewFilm(f2);
    library.addNewFilm(f3);
    library.addNewFilm(f4);
    library.addNewFilm(f5);
}

function fillFilmLibraryTable(filmsList){
    const filmLibraryTable = document.getElementById('film-library-table');

    // Each element in the list will correspond to a table row with 5 columns
    for(let film of filmsList){
        // create tr etc. for the selected 
        const filmElement = createFilmRow(film);
        filmLibraryTable.insertAdjacentHTML('afterbegin', filmElement);
    }
}

function createFilmRow(film){
    return `<tr> 
                <td>${film.title}</td>
                <td>${film.favorite}</td>
                <td>${film.date}</td>
                <td>${film.rating}</td>
            </tr>`;
}

function main(){
    let library = new FilmLibrary();
    populateLibrary(library);

    let lastSelectedButton = document.getElementById('list-all');
    // Populate the HTML people
    fillFilmLibraryTable(library.getAllFilms());

    document.getElementById('list-all').addEventListener('click', event => {
        console.log('click All button');

        // filter films
        let filteredFilms = library.getAllFilms();

        // Modify HTML title above the table
        document.getElementById('selection-title').innerHTML = 'All';
        
        // Modify HTML table
        document.getElementById('film-library-table').innerHTML = '';
        fillFilmLibraryTable(filteredFilms);

        // Set the current button as active
        lastSelectedButton = activate(lastSelectedButton,document.getElementById('list-all'));
    });

    document.getElementById('list-favorites').addEventListener('click', event => {
        console.log('click Favourite button');

        // filter films
        let filteredFilms = library.getFavouriteFilms();

        // Modify HTML title above the table
        document.getElementById('selection-title').innerHTML = 'Favorites';
        
        // Modify HTML table
        document.getElementById('film-library-table').innerHTML = '';
        fillFilmLibraryTable(filteredFilms);

        // Set the current button as active
        lastSelectedButton = activate(lastSelectedButton,document.getElementById('list-favorites'));
    });

    document.getElementById('list-best-rated').addEventListener('click', event => {
        console.log('click BestRated button');

        // filter films
        let filteredFilms = library.getBestRatedFilms();

        // Modify HTML title above the table
        document.getElementById('selection-title').innerHTML = 'Best Rated';

        // Modify HTML table
        document.getElementById('film-library-table').innerHTML = '';
        fillFilmLibraryTable(filteredFilms);

        // Set the current button as active
        lastSelectedButton = activate(lastSelectedButton,document.getElementById('list-best-rated'));
    });

    document.getElementById('list-seen-last-month').addEventListener('click', event => {
        console.log('click LastSeen button');

        // filter films
        let filteredFilms = library.getSeenLastMonthFilms();

        // Modify HTML title above the table
        document.getElementById('selection-title').innerHTML = 'Seen Last Month';

        // Modify HTML table
        document.getElementById('film-library-table').innerHTML = '';
        fillFilmLibraryTable(filteredFilms);

        // Set the current button as active
        lastSelectedButton = activate(lastSelectedButton,document.getElementById('list-seen-last-month'));
    });



}

function activate(lastSelectedButton,element){
    lastSelectedButton.classList.remove('active');
    element.classList.add('active');
    return element;
}

main();