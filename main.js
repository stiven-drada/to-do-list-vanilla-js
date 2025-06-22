const list = document.getElementById("list");
const btnAddGrup = document.getElementById("btn-create-grup-tasks");
const btnAddTask = document.getElementById("btn-create-task");
const containerBtnAddTask = document.querySelector(".container-create-task");

btnAddGrup.addEventListener("click", () => {
  modal("create-grup-task");
});

btnAddTask.addEventListener("click", () => {
  modal("create-task");
});

function createGrup(title, tasks, position) {
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
    const component = e.currentTarget.closest(".list__item--grup");
    const tasks = component.querySelectorAll("span");
    const grupTask = {};
    tasks.forEach((span, index) => {
      if (index === 0) {
        grupTask["title"] = span.innerText;
      } else {
        grupTask[`task${index}`] = span.innerText;
      }
    });

    grupTask["containerTask"] = Array.from(list.children).indexOf(component);
    if (!document.querySelector(".modal")) {
      modal("edit-grup-task", grupTask);
    }
  });

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.addEventListener("click", (e) => {
    const deleteGrup = e.currentTarget.closest(".list__item--grup");
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

  if (position !== undefined) {
    list.replaceChild(container, list.children[position]);
  } else {
    list.appendChild(container);
  }
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
  btnEdit.addEventListener("click", (e) => {
    const task = {};
    task["task1"] = e.currentTarget
      .closest(".list__item")
      .querySelector("span").innerText;

    task["containerTask"] = Array.from(list.children).indexOf(
      e.currentTarget.closest(".list__item")
    );
    modal("edit-task", task);
  });

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.addEventListener("click", deleteTask);

  const divBtns = document.createElement("div");
  divBtns.classList.add("list__btns");
  if (typeof containerTask === "number" || containerTask === undefined) {
    divBtns.appendChild(btnEdit);
  }

  divBtns.appendChild(btnDelete);

  li.append(divInfo, divBtns);

  if (containerTask instanceof HTMLElement) {
    containerTask.append(li);
  } else if (
    list.children[0] === undefined &&
    typeof containerTask === "number"
  ) {
    list.appendChild(li);
  } else if (typeof containerTask === "number") {
    list.replaceChild(li, list.children[containerTask]);
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

  const inputDescription = document.createElement("input");
  inputDescription.type = "text";
  inputDescription.placeholder = "Descripcion";

  const containerInputs = document.createElement("article");
  containerInputs.classList.add("modal__inputs");
  if (type === "create-grup-task" || type === "edit-grup-task") {
    if (type === "edit-grup-task" && Object.keys(editGrup).length !== 0) {
      inputTitle.value = editGrup.title;
    }
    containerInputs.appendChild(inputTitle);
  }
  if (
    (type === "edit-task" || type === "edit-grup-task") &&
    editGrup.task1.length > 0
  ) {
    inputDescription.value = editGrup.task1;
  }
  containerInputs.appendChild(inputDescription);

  if (type === "edit-grup-task" && Object.keys(editGrup).length !== 0) {
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
    if (type === "create-grup-task" || type === "edit-grup-task") {
      accept(e, type, editGrup.containerTask);
    } else if (type === "edit-task") {
      accept(e, type, editGrup);
    } else if (type === "create-task") {
      accept(e, type);
    }
  });

  const btnCancel = document.createElement("button");
  btnCancel.type = "button";
  btnCancel.innerText = "Cancelar";
  btnCancel.addEventListener("click", (e) => {
    if (type === "edit-grup-task" && Object.keys(editGrup).length !== 0) {
      cancel(e, type, editGrup);
    } else if (type === "edit-task" && Object.keys(editGrup).length !== 0) {
      cancel(e, type, editGrup);
    } else {
      cancel(e);
    }
  });

  const continerConfirmBtns = document.createElement("div");
  continerConfirmBtns.classList.add("modal__confirm-btns");
  continerConfirmBtns.append(btnCancel, btnConfirm);

  const continerConfirm = document.createElement("article");
  continerConfirm.classList.add("modal__confirm");
  continerConfirm.appendChild(continerConfirmBtns);
  container.appendChild(containerInputs);
  if (type === "create-grup-task" || type === "edit-grup-task") {
    container.appendChild(containerAddBtn);
  }
  container.appendChild(continerConfirm);

  if (
    (type === "edit-task" || type === "edit-grup-task") &&
    Object.keys(editGrup).length !== 0
  ) {
    list.replaceChild(container, list.children[editGrup.containerTask]);
  } else {
    list.appendChild(container);
  }
}

function toggleTask(e) {
  const isOpen = e.currentTarget.classList.toggle("open");

  e.currentTarget.innerHTML = isOpen
    ? `<i class="fa-solid fa-caret-down"></i>`
    : '<i class="fa-solid fa-caret-right"></i>';

  const ul = e.currentTarget.closest(".list__item--grup").querySelector("ul");

  isOpen
    ? (ul.classList.remove("list--grup-off"), ul.classList.add("list--grup-on"))
    : (ul.classList.remove("list--grup-on"),
      ul.classList.add("list--grup-off"));
}

function cancel(e, type, taks) {
  const modal = e.currentTarget.closest(".modal");
  if (taks !== undefined && type === "edit-grup-task") {
    let arrayTask = [];
    Object.keys(taks).forEach((key) => {
      if (key !== "title" && key !== "containerTask") {
        arrayTask.push(taks[key]);
      }
    });
    createGrup(taks.title, arrayTask, taks.containerTask);
  } else if (taks !== undefined && type === "edit-task") {
    createTask(taks.task1, taks.containerTask);
  } else {
    modal.remove();
  }
  containerBtnAddTask.style.display = "block";
}
function accept(e, type, containerTask) {
  const modal = e.currentTarget.closest(".modal");
  if (type === "create-grup-task" || type === "edit-grup-task") {
    const modalInputs = modal.querySelectorAll("input");
    let title;
    const tasks = [];

    modalInputs.forEach((input, index) => {
      if (index < 1) {
        title = input.value;
      } else {
        tasks.push(input.value);
      }
    });
    if (containerTask === undefined) {
      createGrup(title, tasks);
    } else {
      editGrup(containerTask, title, tasks);
    }
  } else if (type === "edit-task") {
    const description = modal.querySelector("input").value;
    editTask(description, containerTask.containerTask);
  } else if (type === "create-task") {
    const description = modal.querySelector("input").value;
    createTask(description);
  }
  modal.remove();
  containerBtnAddTask.style.display = "block";
}
function deleteInput(e) {
  const deleteInput = e.currentTarget.parentElement;
  deleteInput.remove();
}
function deleteTask(e) {
  const deleteTask = e.currentTarget.closest(".list__item");
  deleteTask.remove();
}
function editTask(descirption, position) {
  createTask(descirption, position);
}
function editGrup(container, title, tasks) {
  const index = container;
  createGrup(title, tasks, index);
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
// investigar como trabajar con cookies y por que son importantes
// crear apuntes de los metodos de objetos que uso
// repasar como eso de que todo en js es un objeto

// los imput tiene que poder tner saltos de linea y ser un poco mas largo (opcional)
// hay que verificar que los inputs no esten vacios o si estan vacios que no creee nada
//
