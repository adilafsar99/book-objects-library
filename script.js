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
}

const removeFromLibrary = function (id) {
   library = library.filter(book => book.id !== id);
}


const library = [];

let book = new Books('No Longer Human', 'Osamu Dazai', '177', false);

const addBookButton = document.querySelector('#add-button');
const addBookModal = document.querySelector('#add-book-modal');
addBookButton.addEventListener('click', () => addBookModal.showModal());