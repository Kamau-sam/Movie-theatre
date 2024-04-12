// Selecting DOM elements
const movieTitle = document.getElementById("title");
const runtime = document.getElementById("runtime");
const filmInfo = document.getElementById("film-info");
const showtime = document.getElementById("showtime");
const moviePoster = document.querySelector("#poster");
const ticketNum = document.querySelector("#ticket-num");
const remainingTickets = document.querySelector("#remaining-tickets");
const buyTicket = document.getElementById("buy-ticket");
const deleteButton = document.getElementById("delete-button");
const url = "http://localhost:3000/films";
// Variables to store movie data
let currentMovie = null;
let MoviesData = [];
// Fetch movies when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();
});
// Function to fetch movies
function fetchMovies() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        MoviesData = data;
        if (data.length > 0) {
          currentMovie = data[0];
          renderInfo(currentMovie);
        }
        displayMenu(MoviesData);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
// Function to render details of a specific movie
function renderInfo(movie) {
  moviePoster.setAttribute("src", `${movie.poster}`);
  movieTitle.textContent = movie.title;
  runtime.textContent = `${movie.runtime} minutes`;
  filmInfo.textContent = movie.description;
  showtime.textContent = movie.showtime;
  ticketNum.innerText = `${movie.capacity} tickets`;
  let availableTickets = movie.capacity - movie.tickets_sold;
  remainingTickets.innerText = `${availableTickets} remaining tickets`;
  buyTicket.textContent =
    movie.tickets_sold >= movie.capacity ? "Sold Out" : "Buy Ticket";
  buyTicket.disabled = movie.tickets_sold >= movie.capacity;
  buyTicket.removeEventListener("click", buyingticket);
  buyTicket.addEventListener("click", buyingticket);
}
// Function to handle ticket purchase
function buyingticket() {
  if (currentMovie && currentMovie.tickets_sold < currentMovie.capacity) {
    currentMovie.tickets_sold++;
    updateTickets(currentMovie);
  }
}
// Function to display the list of movies
function displayMenu(movieList) {
  const sidebar = document.getElementById("films");
  sidebar.innerHTML = "";
  movieList.forEach((movie) => {
    const listItem = document.createElement("li");
    listItem.className = "film item";
    listItem.id = movie.title;
    listItem.textContent = movie.title;
    const deleteButton = document.createElement("button");
    deleteButton.className = "deleteFilm";
    deleteButton.innerText = "Delete Film";
    listItem.appendChild(deleteButton);
    sidebar.appendChild(listItem);
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      removeFilm(movie.id);
    });

    listItem.addEventListener("click", () => {
      currentMovie = movie;
      renderInfo(movie);
    });
  });
}
// Function to update the number of tickets sold
function updateTickets(movie) {
  fetch(`${url}/${movie.id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(movie),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((updatedMovie) => {
      currentMovie = updatedMovie;
      renderInfo(updatedMovie);
    })
    .catch((error) => {
      console.error("error is", error);
    });
}
// Function to remove a movie from the list
function removeFilm(movieId) {
  fetch(`${url}/${movieId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(() => {
      MoviesData = MoviesData.filter((movie) => movie.id !== movieId);
      currentMovie = null;
      // Clear movie details display
      moviePoster.removeAttribute("src");
      movieTitle.textContent = "";
      runtime.textContent = "";
      filmInfo.textContent = "";
      showtime.textContent = "";
      ticketNum.innerText = "";
      buyTicket.setAttribute("disabled", true);
      deleteButton.setAttribute("disabled", true);
      displayMenu(MoviesData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// Function to add a new movie
function addMovie(movie) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("unsuccesful");
      }
      return response.json();
    })
    .then((newMovie) => {
      MoviesData.push(newMovie);
      displayMenu(MoviesData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
