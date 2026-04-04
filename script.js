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

class Library {
    bookArray = [];

    addBook = (title, author, pages, isRead) => {
        if (this.bookArray.every(book => book.title !== title)) {
            let newBook = new Book(title, author, pages, isRead);
            newBook.id = crypto.randomUUID();
            this.bookArray.push(newBook);
            return newBook;
        }
    }

    updateBook = (bookId, title, author, pages, isRead) => {
        const targetBook = this.findBook('id', bookId);
        targetBook.title = title;
        targetBook.author = author;
        targetBook.pages = pages;
        targetBook.isRead = isRead;
    }

    findBook = (searchParam, paramValue) => {
        return this.bookArray.find(book => book[searchParam] === paramValue);
    }

    removeBook = (unneededBook) => {
        this.bookArray = this.bookArray.filter(book => book.id !== unneededBook.id);
        return unneededBook;
    }

    clearLibrary = () => {
        this.bookArray.length = 0;
    }
}

class UI {
    library = new Library();

    targetBookId = null;

    constructor() {
        this.init();
        this.bindEvents();
        this.renderBooks(this.library.bookArray);
    }

    init() {
        this.addBookButton = document.querySelector('#add-button');
        this.searchParamSelect = document.querySelector('#search-param-select');
        this.searchValueInput = document.querySelector('#search-value-input');
        this.searchButton = document.querySelector('#search-button');
        this.addBookModal = document.querySelector('#add-book-modal');
        this.addBookForm = document.querySelector('#add-book-form');
        this.closeModalButton = document.querySelector('#modal-button');
        this.bookList = document.querySelector('.book-list');
        this.instruction = document.querySelector('.instruction-div');
        this.confirmationModal = document.querySelector('#confirm-choice-modal');
        this.confirmButton = document.querySelector('#confirm-button');
        this.cancelButton = document.querySelector('#cancel-button');
        this.inputNodes = document.querySelectorAll('.form-input');
        this.inputs = Array.from(this.inputNodes);
        this.titleInput = this.inputs[0];
        this.authorInput = this.inputs[1];
        this.pagesInput = this.inputs[2];
        this.isReadInput = this.inputs[3];
    }

    bindEvents() {
        this.addBookButton.addEventListener('click', () => this.addBookModal.showModal());
        this.addBookForm.addEventListener('submit', this.getBookData);
        this.searchButton.addEventListener('click', this.searchLibrary);
        this.searchValueInput.addEventListener('input', this.searchLibrary)
        this.confirmButton.addEventListener('click', this.removeFromLibrary)
        this.cancelButton.addEventListener('click', () => this.confirmationModal.close())
    }

    renderBooks = (books) => {
        this.bookList.innerHTML = '';  // To avoid duplication of cards
        if (books.length === 0) {
            this.instruction.classList.add('show');
        }
        else {
            this.instruction.classList.remove('show');
            books.forEach(book => {
                const title = document.createElement('p');
                title.classList.add('title');
                title.textContent = book.title;

                const author = document.createElement('p');
                author.classList.add('author');
                author.textContent = book.author;

                const pages = document.createElement('p');
                pages.classList.add('pages');
                pages.textContent = book.pages;

                const status = document.createElement('p');
                status.classList.add('status');
                status.textContent = book.isRead ? 'Read' : 'Not read';

                const infoSection = document.createElement('div');
                infoSection.classList.add('info-section');
                infoSection.appendChild(title);
                infoSection.appendChild(author);
                infoSection.appendChild(pages);
                infoSection.appendChild(status);

                const toggleIcon = document.createElement('span');
                toggleIcon.classList.add('fa-regular', 'fa-circle-check');
                const toggleButton = document.createElement('button');
                toggleButton.classList.add('toggle-button');
                toggleButton.appendChild(toggleIcon);
                toggleButton.addEventListener('click', this.changeBookStatus);

                const editIcon = document.createElement('span');
                editIcon.classList.add('fa-regular', 'fa-pen-to-square');
                const editButton = document.createElement('button');
                editButton.classList.add('edit-button');
                editButton.appendChild(editIcon);
                editButton.addEventListener('click', this.fillModalForm);

                const deleteIcon = document.createElement('span');
                deleteIcon.classList.add('fa-regular', 'fa-trash-can');
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.appendChild(deleteIcon);
                deleteButton.addEventListener('click', this.showConfirmationModal);

                const buttonSection = document.createElement('div');
                buttonSection.classList.add('button-section');
                buttonSection.appendChild(toggleButton);
                buttonSection.appendChild(editButton);
                buttonSection.appendChild(deleteButton);

                const bookCard = document.createElement('div');
                bookCard.classList.add('book');
                bookCard.setAttribute('data-book-id', book.id);
                bookCard.appendChild(infoSection);
                bookCard.appendChild(buttonSection);

                this.bookList.appendChild(bookCard);
            })
        }
    }

    getBookData = (event) => {
        event.preventDefault();
        this.addBookModal.close();
        this.isReadInput.disbled = false;
        const bookId = this.targetBookId;
        let title = this.titleInput.value;
        let author = this.authorInput.value;
        let pages = this.pagesInput.value;
        let isRead = this.isReadInput.checked ? true : false;
        if (bookId) {
            this.library.updateBook(bookId, title, author, pages, isRead);
        }
        else {
            this.library.addBook(title, author, pages, isRead);
        }
        this.addBookForm.reset(); // To clear the input fields
        this.addBookForm.setAttribute('data-book-id', ''); // To clear the id of the edited book
        this.renderBooks(this.library.bookArray);
    }

    searchLibrary = () => {
        const searchParam = this.searchParamSelect.value;
        const searchParamValue = this.searchValueInput.value;
        const searchResult = this.library.bookArray.filter(book => book[searchParam].includes(searchParamValue));
        if (searchResult.length) {
            this.renderBooks(searchResult);
        }
    }

    changeBookStatus = (event) => {
        const button = event.target;
        const bookCard = button.closest('.book');
        const bookId = bookCard.dataset.bookId;
        const targetBook = this.library.findBook('id', bookId);
        targetBook.changeStatus();
        this.renderBooks(this.library.bookArray);
    }

    fillModalForm = (event) => {
        const button = event.target;
        const bookCard = button.closest('.book');
        this.targetBookId = bookCard.dataset.bookId;
        const targetBook = this.library.findBook('id', this.targetBookId);
        this.titleInput.value = targetBook.title;
        this.authorInput.value = targetBook.author;
        this.pagesInput.value = targetBook.pages;
        this.isReadInput.checked = targetBook.isRead;
        this.closeModalButton.textContent = 'Update';
        this.addBookModal.showModal();
    }

    showConfirmationModal = (event) => {
        const button = event.target;
        const bookCard = button.closest('.book');
        this.targetBookId = bookCard.dataset.bookId;
        this.confirmationModal.showModal();
    }

    removeFromLibrary = () => {
        this.confirmationModal.close();
        const bookId = this.targetBookId;
        const targetBook = this.library.findBook('id', bookId);
        this.library.removeBook(targetBook);
        this.renderBooks(this.library.bookArray);
    }

}

const ui = new UI();