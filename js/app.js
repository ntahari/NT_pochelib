var myBooks = document.getElementById("myBooks");
var content = document.getElementById("content");

// create div for messages info
var msgInfoContent = document.createElement("div");
msgInfoContent.classList.add("msg-info");

// creat button "ajouter"
var addBtn = document.createElement("BUTTON");
addBtn.appendChild(document.createTextNode("Ajouter un livre"));
addBtn.classList.add("btn", "btn--add");
myBooks.insertBefore(addBtn, myBooks.children[2]);

// create books content result of search
const resultContainer = document.createElement("div");
resultContainer.id = "result_content";
resultContainer.style.display = "none";
var booksContent = document.createElement("div");
booksContent.id = "books_content";
booksContent.setAttribute("class", "book-grid");
var h2booksContent = document.createElement("h2");
h2booksContent.innerHTML = "Résultat de la recherche";
var hrBooksContent = document.createElement("hr");
resultContainer.insertBefore(h2booksContent, resultContainer.children[1]);
resultContainer.insertBefore(booksContent, resultContainer.children[2]);
resultContainer.appendChild(hrBooksContent);
content.insertBefore(resultContainer, content.children[0]);

// create my pochlist content 
const pochlistContent = document.createElement("div");
pochlistContent.id = "pochlist_content";
var pochlist = document.createElement("div");
pochlist.id = "pochlist";
pochlist.setAttribute("class", "book-grid");
var hrContent = document.getElementsByTagName("hr")[0];
pochlistContent.appendChild(pochlist);
content.appendChild(pochlistContent);

/* creat search form */
var formContainer = document.createElement("div");
formContainer.id = "form_container";
var form = document.createElement("form");
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
authorField.classList.add("field__input");
var authorLabel = document.createElement("label");
authorLabel.setAttribute("for", "author");
authorLabel.appendChild(document.createTextNode("Auteur"));

// creat input and label for title's field
var titleField = document.createElement("input");
titleField.name = "title";
titleField.id = "title";
titleField.type = "text";
titleField.classList.add("field__input");
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

// show form
addBtn.onclick = (e) => {
    e.preventDefault();
    formContainer.style.display = 'block';
    cancelBtn.style.display = 'block';
    addBtn.style.display = 'none';
}

// hide form + search's result
cancelBtn.onclick = (e) => {
    e.preventDefault();
    formContainer.style.display = 'none';
    resultContainer.style.display = "none";
    titleField.value = "";
    authorField.value = "";
    addBtn.style.display = "block";
}

/*construct the form */
myBooks.insertBefore(formContainer, myBooks.children[2]);
formContainer.appendChild(form);
form.appendChild(createField(authorLabel, authorField));
form.appendChild(createField(titleLabel, titleField));
form.appendChild(submitBtn);
form.appendChild(cancelBtn);

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    booksContent.innerHTML = "";
    var titleSearch = titleField.value;
    var authorSearch = authorField.value;
    if (titleSearch == "" || authorSearch == "") {
        alert("Veuillez remplir les 2 champs !");
        return;
    }
    searchBooks();
});

/* function search books from Api google books */
function searchBooks() {
    var titleSearch = titleField.value;
    var authorSearch = authorField.value;
    msgInfoContent.remove();
    var booksUrl = "https://www.googleapis.com/books/v1/volumes?q=intitle:" +
        titleSearch + "+inauthor:" + authorSearch;

    fetch(booksUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            resultContainer.style.display = "block";
            if (value.items === undefined) {
                msgInfoContent.innerHTML = `<p> Aucun livre n'a été trouvé !</p>`;
                resultContainer.insertBefore(msgInfoContent, resultContainer.lastElementChild);
                return;
            } else {
                for (var i = 0; i < value.items.length; i++) {
                    var item = value.items[i];
                    createBook(item, booksContent);
                }
            }
        })
        .then(function(err) {

        });
}

/* function to create book's content */
function createBook(book, container) {
    var bookPrev = document.createElement('div');
    bookPrev.id = "book_prev-" + book.id;
    bookPrev.classList.add("book-grid__prev");

    var title = book.volumeInfo.title;
    var author, description, img;

    var iconInfo = addIcon(book.id);
    var missingInfo = "Information manquante";

    if (book.volumeInfo.authors) {
        author = book.volumeInfo.authors[0];
    } else {
        author = missingInfo;
    }
    // limit description to 200 caracters
    if (book.volumeInfo.description) {
        description = book.volumeInfo.description;
        if (description.length > 200) {
            description = description.slice(0, 199);
            description = description.substring(0, description.lastIndexOf(" "));
            if (!description.endsWith(".")) {
                description += "...";
            }
        }
    } else {
        description = missingInfo;
    }
    if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        img = book.volumeInfo.imageLinks.thumbnail
    } else {
        img = "./images/unavailable.png";
    }

    bookPrev.innerHTML =
        `<div class = "book-grid__prev__txt">
        <div class = "book-grid__prev__txt__info"><h3>Titre: ${title}</h3>
        <p><b>ID: ${book.id}</b></p>
        <p><b>Auteur: </b>${author}</p>
        <p><b>Déscription: </b>${description} <p></div>
        <div class = "book-grid__prev__txt__icon">
        <i id="${iconInfo.name}-${book.id}" class="fas fa-${iconInfo.name}" title="${iconInfo.title}"></i></div>
        </div>
        <div class = "book-grid__prev__img"><img src = "${img}"/></div>`;
    container.appendChild(bookPrev);

    // create an object to contains session storage of favorite books
    favBook = {
            'id': book.id,
            volumeInfo: {
                'title': title,
                authors: {
                    0: author
                },
                'description': description,
                imageLinks: {
                    'thumbnail': img,
                }
            }
        }
        // call functions add/remove book with icons
    if (iconInfo) {
        if (iconInfo.name == "bookmark") {
            addToFavourite(book.id, favBook);
        }
        if (iconInfo.name == "trash") {
            removeFromFavourite(book.id);
        }
    }
}

// function to add icon bookmark/trash
function addIcon(id) {
    var bookmarkEle = document.getElementById("bookmark-" + id);
    var iconInfo = {
        name: "bookmark",
        title: "Ajouter ce livre dans ma poche'liste",
    };
    var bookIdsSession = sessionStorage.getItem(id);
    if (document.body.contains(bookmarkEle) || bookIdsSession) {
        iconInfo.name = "trash";
        iconInfo.title = "Supprimer ce livre de ma poch'list";
    }
    return iconInfo;
}

// function add book to favourite
function addToFavourite(bookId, favBook) {
    document.getElementById("bookmark-" + bookId).addEventListener("click", (e) => {
        e.preventDefault();
        if (sessionStorage.getItem(bookId)) {
            alert("vous ne pouvez pas ajouter le même livre deux fois");
            return;
        }
        sessionStorage.setItem(bookId, JSON.stringify(favBook));
        showFavBook();
    });
}
// function remove book from favourite
function removeFromFavourite(bookId) {
    var trashIcon = document.getElementById("trash-" + bookId);
    trashIcon.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem(bookId);
        trashIcon.closest(".book-grid__prev").remove();
    });
}

// function to show favorite books
function showFavBook() {
    pochlist.innerHTML = "";
    let books = Object.keys(sessionStorage);
    for (let bookId of books) {
        favBook = JSON.parse(sessionStorage.getItem(bookId));
        createBook(favBook, pochlist);
    }
}
//show pochlist on page refresh
window.onload = function() {
    showFavBook();
}