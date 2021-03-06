import React, { Component } from "react";
import Header from "./Components/Header/Index.js";
import Main from "./Components/Main/Index.js";
import { booksJson } from "./Services/ApiBook";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: booksJson,
      genres: [],
      genresFiltered: [],
      isLoaded: false,
      apiResponse: ""
    };
    this.handleDeleteBook = this.handleDeleteBook.bind(this);
    this.handleModifyBook = this.handleModifyBook.bind(this);
    this.handleNewBook = this.handleNewBook.bind(this);
    this.handleDeleteGenre = this.handleDeleteGenre.bind(this);
    this.handleAddGenre = this.handleAddGenre.bind(this);
    this.handleSelectGenre = this.handleSelectGenre.bind(this);
    this.handleDeleteAllGenre = this.handleDeleteAllGenre.bind(this);
    this.handleDeleteAllBook = this.handleDeleteAllBook.bind(this);
    this.handleDeleteGlobalGenre = this.handleDeleteGlobalGenre.bind(this);
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.json())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
      }

  componentDidMount() {
    this.getGenres();
    this.callAPI();
    setTimeout(
      function() {
        this.setState(prevState => {
          const newState = {
            isLoaded: true
          };
          return newState;
        });
      }.bind(this),
      2000
    );
  }

  getGenres() {
    const auxArray = [];
    booksJson.map(item => {
      return item.genres.map(item => {
        if (auxArray.indexOf(item) === -1) {
          auxArray.push(item);
        }
        return auxArray;
      });
    });
    this.setState(prevState => ({
      genres: auxArray
    }));
  }

  handleSelectGenre(e) {
    const { checked, value } = e;
    let auxArray = this.state.genresFiltered;
    if (!checked) {
      var index = auxArray.indexOf(value);
      if (index !== -1) {
        auxArray.splice(index, 1);
      }
    } else {
      auxArray.push(value);
    }
    this.setState(prevState => ({
      genresFiltered: auxArray
    }));
  }

  getBookList() {
    const { books, genresFiltered, apiResponse } = this.state;
    let auxVar = [];
    for (const book of apiResponse) {
      const found = book.genres.some(r => genresFiltered.indexOf(r) >= 0);
      if (found === true) {
        auxVar.push(book);
      }
    }
    if (auxVar.length !== 0) {
      return auxVar;
    } else {
      return apiResponse;
    }
  }

  handleDeleteAllBook() {
    this.setState({ books: [] });
  }

  handleModifyBook1(name, bookSelected, value) {
    this.setState(prevState => {
      const newState = {
        books: prevState.books.map((book, index) => {
          if (book.id === bookSelected.id) {
            book = {
              ...book,
              [name]: value
            };
          }
          return book;
        })
      };
      return newState;
    });
  }

  handleModifyBook(newBook) {
    let newGenreArray = this.state.genres;
    newBook.genres.map(genre => {
      if (this.isGenreExist(genre) === -1) {
        newGenreArray.push(genre);
      }
      return genre;
    });

    this.setState(prevState => {
      const newState = {
        books: prevState.books.map((book, index) => {
          if (book.id === newBook.id) {
            book = {
              id: newBook.id,
              genres: newBook.genres,
              price: newBook.price,
              tittle: newBook.tittle
            };
          }
          return book;
        }),
        genres: newGenreArray
      };
      return newState;
    });
  }

  handleAddGenre(genre, idBook) {
    this.setState(prevState => {
      const newState = {
        books: prevState.books.map((book, index) => {
          if (book.id === idBook) {
            book = {
              ...book,
              genres: book.genres.concat(genre)
            };
          }
          return book;
        }),
        genres:
          this.isGenreExist(genre) === -1
            ? prevState.genres.concat(genre)
            : prevState.genres
      };
      return newState;
    });
  }

  isGenreExist(inputGenre) {
    const genres = this.state.genres;
    return genres.indexOf(inputGenre);
  }
  
  handleNewBook(newBook) {
    let newGenreArray = this.state.genres;
    newBook.genres.map(genre => {
      if (this.isGenreExist(genre) === -1) {
        newGenreArray.push(genre);
      }
      return genre;
    });
    newBook.id =
      this.state.books.length !== 0
        ? this.state.books[this.state.books.length - 1].id + 1
        : 0;
    this.setState(prevState => ({
      books: prevState.books.concat(newBook),
      genres: newGenreArray
    }));
  }

  handleDeleteGenre(idBook, genre) {
    this.setState(prevState => {
      const newState = {
        books: prevState.books.map((book, index) => {
          if (book.id === idBook) {
            book = {
              ...book,
              genres: genre
            };
          }
          return book;
        })
      };
      return newState;
    });
  }

  handleDeleteGlobalGenre(genreToDelete) {
    this.setState(prevState => {
      const newState = {
        books: prevState.books.map((book, index) => {
          book = {
            ...book,
            genres: book.genres.filter(function(genre) {
              return genre !== genreToDelete;
            })
          };

          return book;
        }),
        genres: prevState.genres.filter(function(genre) {
          return genre !== genreToDelete;
        })
      };
      return newState;
    });
  }

  handleDeleteAllGenre() {
    this.setState(prevState => {
      const newState = {
        books: prevState.books.map((book, index) => {
          book = {
            ...book,
            genres: []
          };

          return book;
        }),
        genres: []
      };
      return newState;
    });
  }

  handleDeleteBook(idBook) {
    this.setState(prevState => {
      const newState = {
        books: prevState.books.filter(book => book.id !== parseInt(idBook))
      };
      return newState;
    });
  }

  render() {
    const { genres, genresFiltered, isLoaded } = this.state;
    return (
      <div className="App">
        <Header />
        <Main
          books={this.getBookList()}
          genres={genres}
          genresFiltered={genresFiltered}
          isLoaded={isLoaded}
          handleSelectGenre={this.handleSelectGenre}
          handleDeleteAllGenre={this.handleDeleteAllGenre}
          handleAddGenre={this.handleAddGenre}
          handleDeleteBook={this.handleDeleteBook}
          handleModifyBook={this.handleModifyBook}
          handleDeleteGenre={this.handleDeleteGenre}
          handleNewBook={this.handleNewBook}
          handleDeleteAllBook={this.handleDeleteAllBook}
          handleDeleteGlobalGenre={this.handleDeleteGlobalGenre}
        />
      </div>
    );
  }
}

export default App;
