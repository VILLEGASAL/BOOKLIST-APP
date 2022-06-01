// Book Class : Represents a Book
class Book {

    constructor(title_, author_, isbn_){

        this.title = title_
        this.author = author_
        this.isbn = isbn_
    }
}

// UI Class : Handle UI Tasks
class UI{

    static displayBooks(){

        let storedbooks = Store.getBooks()

        let books = storedbooks

        books.forEach((book) => {

            UI.addBooktoList(book)
        })
    }

    static addBooktoList(book){

        let list = document.getElementById('book-list') 
        
        let row = document.createElement('tr')

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>
                <button class="btn btn-danger btn-sm delete">DELETE</button>
            </td>
        `

        list.appendChild(row)
    }

    static clearFields(){

        document.querySelector('#title').value = ""
        document.querySelector('#author').value = ""
        document.querySelector('#isbn').value = ""
    }

    static deleteBook(targetElement){

        if(targetElement.classList.contains('delete')){

            targetElement.parentElement.parentElement.remove()

            UI.showAlert("Book Has Been Removed!", "info")
        }
    }

    static showAlert(message, className){

        let alertBox = document.createElement('div')

        alertBox.className = `alert alert-${className}`

        alertBox.textContent = message

        let container = document.querySelector('.container')

        let form = document.querySelector('#book-form')

        container.insertBefore(alertBox, form)

        // Disappear in 3 seconds

        setTimeout(() => {

            document.querySelector(".alert").remove()
        }, 2000)
    }
}

// Store Class : Handles Storage in Local Storage
class Store {

    static getBooks(){

        let books;

        if(localStorage.getItem('books') === null){

            books = []
        
        }else{

            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static addBook(book){

        let books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn){

        let books = Store.getBooks()

        books.forEach((book, index) => {

            if(book.isbn === isbn){

                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}



// Event : Display Books in Table
document.addEventListener('DOMContentLoaded', () => {

    UI.displayBooks()
})

// Event : Add Books
document.getElementById('book-form').addEventListener('submit', (e) => {

    e.preventDefault()

    // Get Form Values
    let title = document.getElementById('title').value
    let author = document.getElementById('author').value
    let isbn = document.getElementById('isbn').value

    // Validations
    if(title === '' || author === '' || isbn === ''){

        UI.showAlert("Please Fill-in All Fields!", "danger")
    
    }else{

        // Create Book Object
        let book = new Book(title, author, isbn)

        // Add Book To UI
        UI.addBooktoList(book)

        // Clear Input fields
        UI.clearFields()

        UI.showAlert("Successfully Added A Book!", "success")

        // Add book to local Storage
        Store.addBook(book)
    }

})

// Event : Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {

    // Remove From The UI Only
    UI.deleteBook(e.target)

    // Remove from the Local Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})