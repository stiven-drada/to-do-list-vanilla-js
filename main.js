const list = document.getElementById("list");
const btnAddGrup = document.getElementById("btn-create-grup-tasks");
const btnAddTask = document.getElementById("btn-create-task");
const containerBtnAddTask = document.querySelector(".container-create-task");

btnAddGrup.addEventListener("click", () => {
  modal("grup-task");
});

btnAddTask.addEventListener("click", modal);

function createGrup(title, tasks) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const btnToggleTask = document.createElement("button");
  btnToggleTask.id = "btnToggleTask";
  btnToggleTask.innerHTML = '<i class="fa-solid fa-caret-right"></i>';
  btnToggleTask.addEventListener("click", toggleTask);

  const span = document.createElement("span");
  span.innerText = title;

  const btnEdit = document.createElement("button");
  btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  btnEdit.addEventListener("click", (e) => {
    // const grupTask = [];
    const grupTask = {};

    const titleGrup =
      e.currentTarget.parentElement.previousElementSibling.children[2]
        .innerText;
    grupTask["title"] = titleGrup;
    // grupTask.push(titleGrup);
    const grup = e.currentTarget.parentElement.parentElement.nextElementSibling;

    Array.from(grup.children).forEach((element, index) => {
      let task = element.innerText;
      grupTask[`task${index + 1}`] = task;
      // grupTask.push(task);
    });
    // console.log(grupTask);
    grupTask["containerTask"] =
      e.currentTarget.parentElement.parentElement.parentElement;
    modal("grup-task", grupTask);
  });

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.addEventListener("click", (e) => {
    const deleteGrup =
      e.currentTarget.parentElement.parentElement.parentElement;
    deleteGrup.remove();
  });

  const divInfo = document.createElement("div");
  divInfo.classList.add("list__info");
  divInfo.append(checkbox, btnToggleTask, span);

  const divBtns = document.createElement("div");
  divBtns.classList.add("list__btns");
  divBtns.append(btnEdit, btnDelete);

  const divMain = document.createElement("div");
  divMain.classList.add("list__item");
  divMain.append(divInfo, divBtns);

  const containerTask = document.createElement("ul");
  containerTask.classList.add("list--grup-off");

  tasks.forEach((description) => {
    createTask(description, containerTask);
  });

  const container = document.createElement("li");
  container.classList.add("list__item--grup");
  container.append(divMain, containerTask);

  list.appendChild(container);
}

function createTask(description, containerTask) {
  const li = document.createElement("li");
  li.classList.add("list__item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.innerText = description;

  const divInfo = document.createElement("div");
  divInfo.classList.add("list__info");
  divInfo.append(checkbox, span);

  const btnEdit = document.createElement("button");
  btnEdit.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.addEventListener("click", deleteTask);

  const divBtns = document.createElement("div");
  divBtns.classList.add("list__btns");
  divBtns.append(btnEdit, btnDelete);

  li.append(divInfo, divBtns);

  if (containerTask) {
    containerTask.append(li);
  } else {
    list.appendChild(li);
  }
}

function modal(type, editGrup = {}) {
  function addInput(text) {
    const adderContainer = document.createElement("div");
    adderContainer.classList.add("modal__adder-container");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("modal__adder-input");
    input.placeholder = "Descripcion";
    input.size = 100;
    input.required = true;
    if (text) {
      input.value = text;
    }

    const deleteAdderBtn = document.createElement("button");
    deleteAdderBtn.type = "button";
    deleteAdderBtn.title = "eliminar tarea";
    deleteAdderBtn.classList.add("modal__adder-btn");
    deleteAdderBtn.innerText = "X";
    deleteAdderBtn.addEventListener("click", deleteInput);

    adderContainer.append(input, deleteAdderBtn);

    containerInputs.appendChild(adderContainer);
  }
  containerBtnAddTask.style.display = "none";
  const container = document.createElement("section");
  container.classList.add("modal");

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.placeholder = "Titulo";
  inputTitle.required = true;

  const inputDescription = document.createElement("input");
  inputDescription.type = "text";
  inputDescription.placeholder = "Descripcion";
  inputDescription.required = true;

  const containerInputs = document.createElement("article");
  containerInputs.classList.add("modal__inputs");
  if (type === "grup-task") {
    if (Object.keys(editGrup).length !== 0) {
      inputTitle.value = editGrup.title;
    }

    containerInputs.appendChild(inputTitle);
  }
  if (Object.keys(editGrup).length !== 0) {
    inputDescription.value = editGrup.task1;
  }
  containerInputs.appendChild(inputDescription);

  if (type === "grup-task" && Object.keys(editGrup).length !== 0) {
    const task = Object.keys(editGrup);
    if (task.length > 2) {
      for (let i = 2; i < task.length; i++) {
        let key = task[i];
        let text = editGrup[key];
        if (key !== "containerTask") {
          addInput(text);
        }
      }
    }
  }

  const btnAdd = document.createElement("button");
  btnAdd.classList.add("modal__add-btn");
  btnAdd.innerHTML = '<i class="fa-solid fa-plus"></i>';
  btnAdd.addEventListener("click", () => {
    addInput();
  });

  const text = document.createElement("p");
  text.classList.add("modal__add-text");
  text.innerText = "Añadir tarea";

  const containerAddBtn = document.createElement("div");
  containerAddBtn.classList.add("modal__container-btn-add");
  containerAddBtn.append(btnAdd, text);

  const btnConfirm = document.createElement("button");
  btnConfirm.type = "button";
  btnConfirm.innerText = "Aceptar";
  btnConfirm.addEventListener("click", (e) => {
    type ? accept(e, type) : accept(e);
  });

  const btnCancel = document.createElement("button");
  btnCancel.type = "button";
  btnCancel.innerText = "Cancelar";
  btnCancel.addEventListener("click", cancel);

  const continerConfirmBtns = document.createElement("div");
  continerConfirmBtns.classList.add("modal__confirm-btns");
  continerConfirmBtns.append(btnCancel, btnConfirm);

  const continerConfirm = document.createElement("article");
  continerConfirm.classList.add("modal__confirm");
  continerConfirm.appendChild(continerConfirmBtns);
  container.appendChild(containerInputs);
  if (type === "grup-task") {
    container.appendChild(containerAddBtn);
  }
  container.appendChild(continerConfirm);

  list.appendChild(container);
}

function toggleTask(e) {
  const isOpen = e.currentTarget.classList.toggle("open");

  e.currentTarget.innerHTML = isOpen
    ? `<i class="fa-solid fa-caret-down"></i>`
    : '<i class="fa-solid fa-caret-right"></i>';
  const ul = e.currentTarget.parentElement.parentElement.nextElementSibling;

  isOpen
    ? (ul.classList.remove("list--grup-off"), ul.classList.add("list--grup"))
    : (ul.classList.remove("list--grup"), ul.classList.add("list--grup-off"));
}

function cancel(e) {
  const modal = e.currentTarget.parentElement.parentElement.parentElement;
  modal.remove();
  containerBtnAddTask.style.display = "block";
}
function accept(e, type) {
  const modal = e.currentTarget.parentElement.parentElement.parentElement;
  if (type === "grup-task") {
    let title;
    const tasks = [];
    const containerInputs =
      e.currentTarget.parentElement.parentElement.previousElementSibling
        .previousElementSibling;
    Array.from(containerInputs.children).forEach((input, index) => {
      if (index < 1) {
        title = input.value;
      } else if (index === 1) {
        tasks.push(input.value);
      } else {
        tasks.push(input.children[0].value);
      }
    });

    createGrup(title, tasks);
  } else {
    const containerInputs =
      e.currentTarget.parentElement.parentElement.previousElementSibling;
    const description = containerInputs.firstElementChild.value;
    createTask(description);
    description.value = "";
  }
  modal.remove();
  containerBtnAddTask.style.display = "block";
}
function deleteInput(e) {
  const deleteInput = e.currentTarget.parentElement;
  deleteInput.remove();
}
function deleteTask(e) {
  const deleteTask = e.currentTarget.parentElement.parentElement;
  deleteTask.remove();
}
function editTask() {}
function editGrup(container) {
  console.log(container);
}

function showTasks() {}

// para mañana
// crear modal para cada tipo de tarea ✅
//  terminar las funciones
// almasenar los datos en local storage
// crear un loguin
// crear base de datos
// si el usuario no se registra se almasena en local storage

// los botones de agregar grupo o tarea solo abre el modal correspondiente ✅
// y los botones dentro del modal son los que crean el tipo de tarea ✅

// los botones de editar grup solo cambia el titulo
// para editar las tareas del grupo tendria que abrir el grupo y selecionar la tarea que quiere editar
// estas ejecutaria la misma logica de una tarea individual

// 🌟 Nota personal (05/06/2025)
// Todo esto que estoy construyendo es una inversión en mí mismo.
// Cada línea de código me acerca más a ese primer trabajo como desarrollador.
// No tengo que ser perfecto, solo constante. Lo estoy logrando.

// refactorisar las lineas 160 -161
// repaso
// repasar los estados http
// investigar sobre peticiones http
// repasar como trabajar con objetos , por ejemplo como iterarlos y como saber si estan vacio

// los imput tiene que poder tner saltos de linea y ser un poco mas largo (opcional)
// hay que verificar que los inputs no esten vacios o si estan vacios que no creee nada
