const Books = function (title, author, pages, isRead) {
    if (!new.target) {
        throw Error('The constructor should only be called with the "new" keyword!');
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Books.prototype.changeStatus = function () {
    this.isRead = !this.isRead;
}

Books.prototype.updateProperty = function (property, value) {
    this[property] = value;
}

const addToLibrary = function (title, author, pages, isRead) {
     let newBook = new Books(title, author, pages, isRead);
     newBook.id = crypto.randomUUID();
     library.push(newBook);
     return newBook;
}

const removeFromLibrary = function (id) {
   library = library.filter(book => book.id !== id);
}

const getBookData = function (event) {
   event.preventDefault();
   addBookModal.close();
   const inputNodes = document.querySelectorAll('.form-input');
   const inputs = Array.from(inputNodes);
   let title = inputs[0].value;
   let author = inputs[1].value;
   let pages = inputs[2].value;
   let isRead = inputs[3].checked ? true : false;
   let newBook = addToLibrary(title, author, pages, isRead);
   addBookForm.reset();
   console.log(newBook);
}


const library = [];

let book = new Books('No Longer Human', 'Osamu Dazai', '177', false);

const addBookButton = document.querySelector('#add-button');
const addBookModal = document.querySelector('#add-book-modal');
const addBookForm = document.querySelector('#add-book-form');
const closeModalButton = document.querySelector('#modal-button');

addBookButton.addEventListener('click', () => addBookModal.showModal());
addBookForm.addEventListener('submit', getBookData)