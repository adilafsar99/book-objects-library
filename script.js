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

const getBookId = function (button) {
    const bookCard = button.closest('.book');
    const bookId = bookCard.dataset.bookId;
    return bookId;
}

const removeFromLibrary = function (event) {
    confirmationModal.close();
    const button = event.target;
    const bookId = button.dataset.bookId;
    library = library.filter(book => book.id !== bookId); 
    showBooks()
}

const changeStatus = function (event) {
    const button = event.target;
    const bookId = getBookId(button);
    for (const book of library) {
        if (book.id == bookId) {
            book.changeStatus();
            showBooks();
        }
    }
}

const handleModal = function (event) {
    const button = event.target;
    const bookId = getBookId(button);
    confirmButton.setAttribute('data-book-id', bookId);
    confirmationModal.showModal();
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
    addToLibrary(title, author, pages, isRead);
    addBookForm.reset();
    showBooks();
}

const showBooks = function () {
    booksList.innerHTML = '';
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
            let id = book.id;

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
            book.setAttribute('data-book-id', id);
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
            editButton.appendChild(editIcon);
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('fa-regular', 'fa-trash-can');
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', handleModal);
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

addBookButton.addEventListener('click', () => addBookModal.showModal());
addBookForm.addEventListener('submit', getBookData);
confirmButton.addEventListener('click', removeFromLibrary)
cancelButton.addEventListener('click', () => confirmationModal.close())

showBooks();