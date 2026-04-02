class Book {
    constructor(title, author, pages, isRead) {
       this.title = title;
       this.author = author;
       this.pages = pages;
       this.isRead = isRead;
    }
    
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get pages() {
        return this._pages;
    }

    set pages(value) {
        this._pages = value;
    }

    get isRead() {
        return this._isRead;
    }

    set isRead(value) {
        this._isRead = value;
    }

    changeStatus = () => this._isRead = !this._isRead; 

}

const addToLibrary = function (title, author, pages, isRead) {
    let newBook = new Book(title, author, pages, isRead);
    newBook.id = crypto.randomUUID();
    library.push(newBook);
    return newBook;
}

// The .closest() method is used to reach the book card div
const changeStatus = function (event) {
    const button = event.target;
    const bookCard = button.closest('.book');
    const bookId = bookCard.dataset.bookId;
    for (const book of library) {
        if (book.id == bookId) {
            book.changeStatus();
            showBooks();
        }
    }
}

const updateBook = function (bookId, title, author, pages, isRead) {
    for (const book of library) {
        if (book.id === bookId) {
           book.title = title;
           book.author = author;
           book.pages = pages;
           book.isRead = isRead;
        }
    }
}

const removeFromLibrary = function (event) {
    confirmationModal.close();
    const button = event.target;
    const bookId = button.dataset.bookId;
    library = library.filter(book => book.id !== bookId);
    showBooks()
}

// This methods fills up the input fields with the data that is currently 
// inside the requested book object
const handleFormModal = function (event) {
    const button = event.target;
    const bookCard = button.closest('.book');
    const bookId = bookCard.dataset.bookId;
    addBookForm.setAttribute('data-book-id', bookId);
    for (const book of library) {
        if (book.id === bookId) {
            titleInput.value = book.title;
            authorInput.value = book.author;
            pagesInput.value = book.pages;
            isReadInput.checked = book.isRead;
        }
    }
    addBookModal.showModal();
}

// I pass the button that was clicked to the modal because if I call the remove function
// from the modal then the event target will be the modal button and not the book card button
const handleConfirmationModal = function (event) {
    const button = event.target;
    const bookCard = button.closest('.book');
    const bookId = bookCard.dataset.bookId;
    confirmButton.setAttribute('data-book-id', bookId);
    confirmationModal.showModal();
}

// This function receives the data from the modal and figures out if 
// the book already exists and to update it or it doesn't and create a new one
const getBookData = function (event) {
    event.preventDefault();
    addBookModal.close();
    isReadInput.disbled = false;
    const bookId = addBookForm.dataset.bookId;
    let title = titleInput.value;
    let author = authorInput.value;
    let pages = pagesInput.value;
    let isRead = isReadInput.checked ? true : false;
    if (bookId) {
        updateBook(bookId, title, author, pages, isRead);
    }
    else {
        addToLibrary(title, author, pages, isRead);
    }
    addBookForm.reset(); // To clear the input fields
    addBookForm.setAttribute('data-book-id', ''); // To clear the id of the edited book
    showBooks();
}

const showBooks = function () {
    booksList.innerHTML = '';  // To avoid duplication of cards
    if (library.length === 0) {
        instruction.classList.add('show');
    }
    else {
        instruction.classList.remove('show');
        library.forEach((book) => {
            let titleValue = book.title;
            let authorValue = book.author;
            let pagesValue = book.pages;
            let isReadValue = book.isRead;
            let bookId = book.id;

            const title = document.createElement('p');
            title.classList.add('title');
            title.textContent = titleValue;
            const author = document.createElement('p');
            author.classList.add('author');
            author.textContent = authorValue;
            const pages = document.createElement('p');
            pages.classList.add('pages');
            pages.textContent = pagesValue;
            const status = document.createElement('p');
            status.classList.add('status');
            status.textContent = isReadValue ? 'Read' : 'Not read';

            const infoSection = document.createElement('div');
            infoSection.classList.add('info-section');
            infoSection.appendChild(title);
            infoSection.appendChild(author);
            infoSection.appendChild(pages);
            infoSection.appendChild(status);
            book = document.createElement('div');
            book.classList.add('book');
            book.setAttribute('data-book-id', bookId);
            book.appendChild(infoSection);

            const toggleIcon = document.createElement('span');
            toggleIcon.classList.add('fa-regular', 'fa-circle-check');
            const toggleButton = document.createElement('button');
            toggleButton.classList.add('toggle-button');
            toggleButton.addEventListener('click', changeStatus);
            toggleButton.appendChild(toggleIcon);
            const editIcon = document.createElement('span');
            editIcon.classList.add('fa-regular', 'fa-pen-to-square');
            const editButton = document.createElement('button');
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', handleFormModal);
            editButton.appendChild(editIcon);
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('fa-regular', 'fa-trash-can');
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', handleConfirmationModal);
            deleteButton.appendChild(deleteIcon);

            const buttonSection = document.createElement('div');
            buttonSection.classList.add('button-section');
            buttonSection.appendChild(toggleButton);
            buttonSection.appendChild(editButton);
            buttonSection.appendChild(deleteButton);
            book.appendChild(buttonSection);

            booksList.appendChild(book);
        }
        )
    }
}


let library = [];

//addToLibrary('No Longer Human', 'Osamu Dazai', '177', false);

const addBookButton = document.querySelector('#add-button');
const addBookModal = document.querySelector('#add-book-modal');
const addBookForm = document.querySelector('#add-book-form');
const closeModalButton = document.querySelector('#modal-button');
const booksList = document.querySelector('.book-list');
const instruction = document.querySelector('.instruction-div');
const confirmationModal = document.querySelector('#confirm-choice-modal');
const confirmButton = document.querySelector('#confirm-button');
const cancelButton = document.querySelector('#cancel-button');
const inputNodes = document.querySelectorAll('.form-input');
const inputs = Array.from(inputNodes);
const titleInput = inputs[0];
const authorInput = inputs[1];
const pagesInput = inputs[2];
const isReadInput = inputs[3];

addBookButton.addEventListener('click', () => addBookModal.showModal());
addBookForm.addEventListener('submit', getBookData);
confirmButton.addEventListener('click', removeFromLibrary)
cancelButton.addEventListener('click', () => confirmationModal.close())

showBooks();