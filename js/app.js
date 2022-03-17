var myBooks = document.getElementById("myBooks");
var content = document.getElementById("content");

// creat button "ajouter"
var addBtn = document.createElement("BUTTON");
addBtn.appendChild(document.createTextNode("Ajouter un livre"));
addBtn.classList.add("btn", "btn--add");
//myBooks.appendChild(addBtn);
myBooks.insertBefore(addBtn, myBooks.children[2]);
//addBtn.after(document.getElementsByClassName("h2")[1]);



/* creat search form */
var formContainer = document.createElement("div");
formContainer.id = "form_container";
var form = document.createElement("form");
//form.method = "POST";
//form.action = "index.html#content";
form.classList.add("form");

// function to create field in form
function createField(label, input) {
    var field = document.createElement("div");
    field.classList.add("form__field");
    field.appendChild(label);
    field.appendChild(input);
    return field;
}

// creat field author
var authorField = document.createElement("input");
authorField.name = "author";
authorField.id = "author";
authorField.type = "text";
authorField.classList.add("field__input")
var authorLabel = document.createElement("label");
authorLabel.setAttribute("for", "author");
authorLabel.appendChild(document.createTextNode("Auteur"));

// creat input and label for title's field
var titleField = document.createElement("input");
titleField.name = "title";
titleField.id = "title";
titleField.type = "text";
titleField.classList.add("field__input")
var titleLabel = document.createElement("label");
titleLabel.setAttribute("for", "title");
titleLabel.appendChild(document.createTextNode("Titre du livre"));

// create submit button
var submitBtn = document.createElement("input");
submitBtn.name = "search_submit";
submitBtn.type = "submit";
submitBtn.value = "Rechercher";
submitBtn.classList.add("btn", "btn--submit");

// create cancel button
var cancelBtn = document.createElement("input");
cancelBtn.name = "cancel_btn";
cancelBtn.type = "submit";
cancelBtn.value = "Annuler";
cancelBtn.classList.add("btn", "btn--cancel", "invisible");

// create books content 
var booksContent = document.createElement("div");
booksContent.id = "books_content";
booksContent.setAttribute("class", "book-grid");
booksContent.style.display = "none";
var h2booksContent = document.createElement("h2");
h2booksContent.innerHTML = "Résultat de la recherche";
h2booksContent.style.display = "none";
var hrContent = document.getElementsByTagName("hr")[0];
var hrBooksContent = document.createElement("hr");
hrBooksContent.style.display = "none";
//booksContent.appendChild(h2booksContent);
content.insertBefore(hrContent, content.children[0]);
content.insertBefore(h2booksContent, content.children[1]);
content.insertBefore(booksContent, content.children[2]);
//booksContent.insertBefore(hrBooksContent, booksContent.children[0]);

// create favorite books content 
var pochlist = document.createElement("div");
pochlist.id = "pochlist";
pochlist.setAttribute("class", "book-grid");
//content.insertBefore(pochlist, myBooks.children[3]);
content.appendChild(pochlist);
//pochlist.after(content.children[1]);


/* function search books from Api google books */
function searchBooks() {
    titleSearch = document.getElementById("title").value;
    authorSearch = document.getElementById("author").value;
    var booksUrl = "https://www.googleapis.com/books/v1/volumes?q=intitle:" + titleSearch + "+inauthor:" + authorSearch;

    fetch(booksUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            //favBookContent.style.display = "none";
            booksContent.style.display = "grid";
            h2booksContent.style.display = "block";
            for (var i = 0; i < value.items.length; i++) {
                var item = value.items[i];
                createBook(item, booksContent);
            }
            hrBooksContent.style.display = "block";
            content.insertBefore(hrBooksContent, content.children[4]);
        })
        .then(function(err) {

        });
}

/* function to create book's content */
function createBook(book, container) {
    var bookPrev = document.createElement('div');
    bookPrev.classList.add("book-grid__prev");
    var title = book.volumeInfo.title;
    var author = book.volumeInfo.authors;
    var description = book.volumeInfo.description;
    var img = book.volumeInfo.imageLinks.thumbnail;
    var iconInfo = addIcon(book.id);
    var missingInfo = "Information manquante";

    if (book.volumeInfo.title === undefined) {
        title = missingInfo;
    }
    if (book.volumeInfo.authors === undefined) {
        author = missingInfo;
    }
    if (book.volumeInfo.description === undefined) {
        description = missingInfo;
    }
    if (book.volumeInfo.imageLinks.thumbnail === undefined) {
        img = "./images/unavailable.png";
    }
    bookPrev.innerHTML =
        `<div class = "book-grid__prev__info"><p><b>Titre: ${title}</b></p>
        <p><b>ID: ${book.id}</b></p>
        <p><b>Auteur: </b>${author[0]}</p>
        <p><b>Déscription: </b>${description.substring(0, 200)} <p></div>
        <div class = "book-grid__prev__icon"><i id="${iconInfo}-${book.id}" class="fas fa-${iconInfo}" title=""></i></div>
        <div class = "book-grid__prev__img"><img src = ${img}/></div>`;
    /* <div class = "book-grid__prev__id"><p><b>ID: ${book.id}</b></p></div>
    <div class = "book-grid__prev__author"><p><b>Auteur: </b>${author[0]}</p></div>
    <div class = "book-grid__prev__desc"><p><b>Déscription: </b>${description.substring(0, 200)} <p></div> */
    container.appendChild(bookPrev);

    // create an object to contains session storage of favorite books
    var favBook = {
        'id': book.id,
        volumeInfo: {
            'title': title,
            'authors': author,
            'description': description,
            imageLinks: {
                'thumbnail': img,
            }
        }
    }
    if (iconInfo == "bookmark") {
        addToFavourite(book.id, favBook);
    }
    if (iconInfo == "trash") {
        removeFromFavourite(book.id);
    }

}

// function to add icon bookmark/trash
function addIcon(id) {
    var bookmarkEle = document.getElementById("bookmark-" + id);
    var iconeName = "bookmark";
    var titleIcone = "Ajouter ce livre dans ma poche'liste";
    if (document.body.contains(bookmarkEle)) {
        iconeName = "trash";
        titleIcone = "Supprimer ce livre de ma poch'list";
    }
    return iconeName;
}

// function add book to favourite
function addToFavourite(iconId, favBook) {
    document.getElementById("bookmark-" + iconId).onclick = (e) => {
        if (sessionStorage.getItem(iconId)) {
            alert("vous ne pouvez pas ajouter le même livre deux fois");
            return;
        }
        sessionStorage.setItem(iconId, JSON.stringify(favBook));
        showFavBook();
    };
}
// function remove book from favourite
function removeFromFavourite(iconId) {
    document.getElementById("trash-" + iconId).onclick = (e) => {
        sessionStorage.removeItem(iconId);
    };
}

/*construct the form */
content.insertBefore(formContainer, content.children[0]);
formContainer.appendChild(form);
form.appendChild(createField(authorLabel, authorField));
form.appendChild(createField(titleLabel, titleField));
form.appendChild(submitBtn);
form.appendChild(cancelBtn);

submitBtn.onclick = (e) => {
    e.preventDefault();
    searchBooks();
    titleField.focus();
};

// show form
addBtn.onclick = (e) => {
    e.preventDefault();
    formContainer.style.display = 'block';
    cancelBtn.style.display = 'block';
    addBtn.style.display = 'none';
}

// hide form
cancelBtn.onclick = (e) => {
    e.preventDefault();
    formContainer.style.display = 'none';
    addBtn.style.display = "block";
    cancelBtn.style.display = "none";
}

// function to show favorite books
function showFavBook() {
    let books = Object.keys(sessionStorage);
    for (let bookId of books) {
        favBook = JSON.parse(sessionStorage.getItem(bookId));
        createBook(favBook, pochlist);
    }
}
window.onload = function() {
    //content.insertBefore(pochlist, content[2]);
    showFavBook();
}