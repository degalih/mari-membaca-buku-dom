const UNCOMPLETED_LIST_BOOK_ID = "uncompleted";
const COMPLETED_LIST_BOOK_ID = "completed";
const BOOK_ITEMID = "itemId";

function makeBook(Judul, Penulis, Tahun, isCompleted) {
  const textTitle = document.createElement("td");
  textTitle.classList.add("judul");
  textTitle.innerText = Judul;

  const textAuthor = document.createElement("td");
  textAuthor.classList.add("penulis");
  textAuthor.innerText = Penulis;

  const textYear = document.createElement("td");
  textYear.classList.add("tahun");
  textYear.innerText = Tahun;

  const button = document.createElement("td");
  button.classList.add("button");

  const Row = document.createElement("tr");
  Row.classList.add("table__data");
  Row.append(textTitle, textAuthor, textYear, button);

  if (isCompleted == true) {
    button.append(createUndoButton(), createDeleteButton());
  } else {
    button.append(createCheckButton(), createDeleteButton());
  }

  return Row;
}

/* Button Template Creator */
function createButton(buttonClass, buttonType, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonClass, buttonType);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });

  return button;
}

function createCheckButton() {
  return createButton("btn", "btn__check", function (event) {
    addBookToCompleted(event.target.parentElement.parentElement);
  });
}

function createDeleteButton() {
  return createButton("btn", "btn__delete", function (event) {
    removeBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function createUndoButton() {
  return createButton("btn", "btn__undo", function (event) {
    undoBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function addBook() {
  const uncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

  const Judul = document.getElementById("judul").value;
  const Penulis = document.getElementById("penulis").value;
  const Tahun = document.getElementById("tahun").value;
  const isCompleted = document.getElementById("isCompleted").checked;

  const book = makeBook(Judul, Penulis, Tahun, isCompleted);
  const bookObject = composeBookObject(Judul, Penulis, Tahun, isCompleted);

  if (isCompleted == true) {
    completed.append(book);
  } else {
    uncompleted.append(book);
  }

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  updateDataToStorage();

  const bookData = {
    id: +new Date(),
    judul: Judul,
    penulis: Penulis,
    tahun: Tahun,
    isCompleted: isCompleted,
  };

  console.log(bookData);
}

/* Menghapus buku yang belum selesai */
function addBookToCompleted(bookElement) {
  const completed = document.getElementById(COMPLETED_LIST_BOOK_ID);

  const Judul = bookElement.querySelector(".judul").innerText;
  const Penulis = bookElement.querySelector(".penulis").innerText;
  const Tahun = bookElement.querySelector(".tahun").innerText;

  const newBook = makeBook(Judul, Penulis, Tahun, true);

  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  completed.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);

  bookElement.remove();
  updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
  const uncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);

  const Judul = bookElement.querySelector(".judul").innerText;
  const Penulis = bookElement.querySelector(".penulis").innerText;
  const Tahun = bookElement.querySelector(".tahun").innerText;

  const newBook = makeBook(Judul, Penulis, Tahun, false);

  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  uncompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
}

function refreshDataFromBooks() {
  const uncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const completed = document.getElementById(COMPLETED_LIST_BOOK_ID);

  for (book of books) {
    const newBook = makeBook(book.Judul, book.Penulis, book.Tahun, book.isCompleted);
    newBook[BOOK_ITEMID] = book.id;

    if (book.isCompleted) {
      completed.append(newBook);
    } else {
      uncompleted.append(newBook);
    }
  }
}
