const fileInput = document.getElementById("files");
const btnBookMagazine = document.getElementById("print-books-magazines");
const btnBookMagazineSort = document.getElementById("print-books-magazines-sort");
const bookTable = document.getElementById("table-books");
const authorTable = document.getElementById("table-authors");
const magazineTable = document.getElementById("table-magazines");
const btnfindByISBN = document.getElementById('find-by-isbn');
const inputISBN = document.getElementById('input-find-book-magazine-isbn');
const btnfindByEmail = document.getElementById('find-by-email');
const inputEmail = document.getElementById('input-find-book-magazine-email');
const addBookMagazine = document.getElementById('add-book-magazine');
const bookForm = document.getElementById('book-form');
const magazineForm = document.getElementById('magazine-form');
const bookRadio = document.getElementById('book-radio');
const magazineRadio = document.getElementById('magazine-radio');
const bookSubmit = document.getElementById('book-submit');
const magazineSubmit = document.getElementById('magazine-submit');
const labelBook = document.getElementById('add-book-label');
const labelMagazine = document.getElementById('add-magazine-label');
let bookArr = [];
let authorArr = [];
let magazineArr = [];

let csvToArray = (str, delimiter = ",") => {
	const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
	const rows = str.slice(str.indexOf("\n") + 1).split("\n");
	const arr = rows.map(function (row) {
		const values = row.split(delimiter);
		const el = headers.reduce(function (object, header, index) {
			object[header] = values[index];
			return object;
		}, {});
		return el;
	});

	return arr;
}

let generateTableHead = (table, data) => {
	let thead = table.createTHead();
	let row = thead.insertRow();
	for (let key of data) {
		let th = document.createElement("th");
		let text = document.createTextNode(key);
		th.appendChild(text);
		row.appendChild(th);
	}
}

let generateTable = (table, data) => {
	for (let element of data) {
		let row = table.insertRow();
		for (key in element) {
			let cell = row.insertCell();
			let text = document.createTextNode(element[key]);
			cell.appendChild(text);
		}
	}
}

let showInTable = (arr, tableName) => {
	let table = document.createElement('table');
	table.setAttribute('id', `table-${tableName}`);
	document.body.appendChild(table);
	let data = Object.keys(arr[0]);
	generateTableHead(table, data);
	generateTable(table, arr);
}

let readFile = function (file) {
	const reader = new FileReader();

	reader.onload = function (e) {
		const text = e.target.result;
		const data = csvToArray(text);
		for (let fileItem of data) {
			let fileObj = {};
			let key = Object.keys(fileItem)[0];
			let values = fileItem[key];
			let keyArr = key.split(';');
			let valueArr = values.split(';');
			for (let i = 0; i < keyArr.length; i++) {
				fileObj[keyArr[i]] = valueArr[i];
			}
			if (file.name.includes('Books')) {
				bookArr.push(fileObj);
			} else if (file.name.includes('Authors')) {
				authorArr.push(fileObj);
			} else if (file.name.includes('Magazines')) {
				magazineArr.push(fileObj);
			}
		}
	};
	reader.readAsText(file);
};

let findBookMagazineByKey = (key, value) => {
	let book = bookArr.filter(e => e[key] == value);
	let magazine = magazineArr.filter(e => (e[key] == value));
	let element = book.length ? book : magazine;
	if (element.length) {
		showInTable(element, `book-magazine-${key}`);
	} else {
		alert('No row found!');
	}
}

let convertToCSVAndDownload = (rows) => {
	let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
	let encodedUri = encodeURI(csvContent);
	let link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	document.body.appendChild(link);

	link.click();
}

btnBookMagazine.addEventListener('click', () => {
	clear();
	if (!fileInput.files || !fileInput.files.length) {
		alert("Please select files!");
		return;
	}
	let fileArr = [...(fileInput.files)];
	fileArr.forEach(file => {
		if (file.name.includes('Books')) {
			showInTable(bookArr, 'books');
		} else if (file.name.includes('Authors')) {
			showInTable(authorArr, 'authors');
		} else if (file.name.includes('Magazines')) {
			showInTable(magazineArr, 'magazines');
		}
	});
});

btnBookMagazineSort.addEventListener('click', () => {
	clear();
	if (!fileInput.files || !fileInput.files.length) {
		alert("Please select files!");
		return;
	}
	let fileArr = [...(fileInput.files)];
	fileArr.forEach(file => {
		if (file.name.includes('Books')) {
			showInTable(bookArr.sort((a, b) => a['title'] < b['title'] ? -1 : 1), 'books');
		} else if (file.name.includes('Authors')) {
			showInTable(authorArr.sort((a, b) => a['title'] < b['title'] ? -1 : 1), 'authors');
		} else if (file.name.includes('Magazines')) {
			showInTable(magazineArr.sort((a, b) => a['title'] < b['title'] ? -1 : 1), 'magazines');
		}
	});
});

btnfindByISBN.addEventListener('click', () => {
	clear();
	if (!fileInput.files || !fileInput.files.length) {
		alert("Please select files!");
		return;
	}
	findBookMagazineByKey('isbn', inputISBN.value);
});

btnfindByEmail.addEventListener('click', () => {
	clear();
	if (!fileInput.files || !fileInput.files.length) {
		alert("Please select files!");
		return;
	}
	findBookMagazineByKey('authors', inputEmail.value);
});

fileInput.addEventListener('change', () => {
	clear();
	let fileArr = [...(fileInput.files)];
	for(let file of fileArr) {
		if (file.type !== "text/csv") {
			fileInput.value = "";
			alert("Please select only csv files");
			return;
		}
	}
	fileArr.forEach(element => readFile(element));
});

addBookMagazine.addEventListener('click', () => {
	clear();
	bookForm.style.display = 'block';
	bookRadio.style.display = 'block';
	magazineRadio.style.display = 'block';
	labelBook.style.display = 'block';
	labelMagazine.style.display = 'block';
});

bookRadio.addEventListener('change', () => {
	bookForm.style.display = 'block';
	magazineForm.style.display = 'none';
	magazineRadio.checked = false;
});

magazineRadio.addEventListener('change', () => {
	bookForm.style.display = 'none';
	magazineForm.style.display = 'block';
	bookRadio.checked = false;
});

magazineSubmit.addEventListener('click', () => {
	let title = document.getElementById('magazine-title').value;
	let isbn = document.getElementById('magazine-isbn').value;
	let authors = document.getElementById('magazine-authors').value;
	let publishedAt = document.getElementById('magazine-publishedAt').value;

	if (!title || !isbn || !authors || !publishedAt) {
		alert("Please fill all the fields");
		return;
	}
	let rows = [['title', 'isbn', 'authors', 'publishedAt'], [title, isbn, authors, publishedAt]];
	convertToCSVAndDownload(rows);
});

bookSubmit.addEventListener('click', () => {
	let title = document.getElementById('book-title').value;
	let isbn = document.getElementById('book-isbn').value;
	let authors = document.getElementById('book-authors').value;
	let description = document.getElementById('book-description').value;

	if (!title || !isbn || !authors || !description) {
		alert("Please fill all the fields");
		return;
	}
	let rows = [['title', 'isbn', 'authors', 'description'], [title, isbn, authors, description]];
	convertToCSVAndDownload(rows);
});

function clear () {
	document.querySelectorAll('table').forEach(table => table.remove());
	bookForm.style.display = 'none';
	bookRadio.style.display = 'none';
	magazineRadio.style.display = 'none';
	magazineForm.style.display = 'none';
	labelBook.style.display = 'none';
	labelMagazine.style.display = 'none';
}
