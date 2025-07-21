const list = document.getElementById("list");
const btnAddGrup = document.getElementById("btn-create-grup-tasks");
const btnAddTask = document.getElementById("btn-create-task");
const containerBtnAddTask = document.querySelector(".container-create-task");
const main = document.querySelector(".container-main");
let auxiliar;
let modalKeyListener;

btnAddGrup.addEventListener("click", () => {
  modal("create-grup-task");
});

btnAddTask.addEventListener("click", () => {
  modal("create-task");
});

function createGroup(title, tasks, position) {
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
    if (
      document.querySelector(".modal") &&
      document.querySelector(".modal").classList.contains("modal--create")
    ) {
      return;
    }
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
      auxiliar = grupTask;
      modal("edit-grup-task", grupTask);
    } else if (document.querySelector(".modal")) {
      if (auxiliar.title?.length) {
        cancel("edit-grup-task", auxiliar);
      } else {
        cancel("edit-task", auxiliar);
      }
      auxiliar = grupTask;
      modal("edit-grup-task", grupTask);
    }
  });

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.addEventListener("click", (e) => {
    const deleteGrup = e.currentTarget.closest(".list__item--grup");
    deleteConfirmationDialog(deleteGrup, "Grupo");
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
    const modal = document.querySelector(".modal");
    const indexModal = Array.from(list.children).indexOf(modal);
    list.replaceChild(container, list.children[indexModal]);
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
    if (
      document.querySelector(".modal") &&
      document.querySelector(".modal").classList.contains("modal--create")
    ) {
      return;
    }
    const task = {};
    task["task1"] = e.currentTarget
      .closest(".list__item")
      .querySelector("span").innerText;

    task["containerTask"] = Array.from(list.children).indexOf(
      e.currentTarget.closest(".list__item")
    );

    if (!document.querySelector(".modal")) {
      auxiliar = task;
      modal("edit-task", task);
      document.querySelector(".modal").classList.add("open");
    } else if (document.querySelector(".modal")) {
      if (auxiliar.title?.length) {
        cancel("edit-grup-task", auxiliar);
      } else {
        cancel("edit-task", auxiliar);
      }

      auxiliar = task;
      modal("edit-task", task);
      document.querySelector(".modal").classList.add("open");
    }
  });

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.addEventListener("click", (e) => {
    const deleteTask = e.currentTarget.closest(".list__item");
    deleteConfirmationDialog(deleteTask, "Tarea");
  });

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
    const modal = document.querySelector(".modal");
    const indexModal = Array.from(list.children).indexOf(modal);
    list.replaceChild(li, list.children[indexModal]);
  } else {
    list.appendChild(li);
  }
}

function modal(modalMode, editGrup = {}) {
  if (modalKeyListener) {
    document.removeEventListener("keydown", modalKeyListener);
    modalKeyListener = null;
  }

  containerBtnAddTask.style.display = "none";
  const container = document.createElement("section");
  let mode = modalMode.startsWith("create") ? "modal--create" : "modal--edit";
  container.classList.add("modal", mode);

  const inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.placeholder = "Titulo";
  inputTitle.addEventListener("input", () => {
    if (inputDescription.value !== "" && inputTitle.value !== "") {
      setAcceptButtonEnabled(false);
    } else {
      setAcceptButtonEnabled(true);
    }
  });

  const inputDescription = document.createElement("input");
  inputDescription.type = "text";
  inputDescription.placeholder = "Descripcion";
  inputDescription.addEventListener("input", () => {
    if (modalMode === "create-task" || modalMode === "edit-task") {
      if (inputDescription.value === "") {
        setAcceptButtonEnabled(true);
      } else {
        setAcceptButtonEnabled(false);
      }
    } else {
      if (inputDescription.value !== "" && inputTitle.value !== "") {
        setAcceptButtonEnabled(false);
      } else {
        setAcceptButtonEnabled(true);
      }
    }
  });

  const containerInputs = document.createElement("article");
  containerInputs.classList.add("modal__inputs");
  if (modalMode === "create-grup-task" || modalMode === "edit-grup-task") {
    if (modalMode === "edit-grup-task" && Object.keys(editGrup).length !== 0) {
      inputTitle.value = editGrup.title;
    }
    containerInputs.appendChild(inputTitle);
  }
  if (
    (modalMode === "edit-task" || modalMode === "edit-grup-task") &&
    editGrup.task1?.length > 0
  ) {
    inputDescription.value = editGrup.task1;
  }
  containerInputs.appendChild(inputDescription);

  if (modalMode === "edit-grup-task" && Object.keys(editGrup).length !== 0) {
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
  btnAdd.title = "Añadir tarea (Ctrl + Enter)";
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
  switch (modalMode) {
    case "create-grup-task":
      btnConfirm.innerText = "crear grupo";
      focusInput(inputTitle);
      break;
    case "create-task":
      btnConfirm.innerText = "crear tarea";
      focusInput(inputDescription);
      break;
    case "edit-grup-task":
    case "edit-task":
      btnConfirm.innerText = "guardar cambios";
      if (modalMode === "edit-task") {
        focusInput(inputDescription);
      } else {
        focusInput(inputTitle);
      }
      break;
  }
  btnConfirm.id = "btn-accept";
  btnConfirm.classList.add("modal__btn-confirm-disabled");
  btnConfirm.title = "Confirmar (Enter)";
  if (Object.keys(editGrup).length !== 0) {
    btnConfirm.disabled = false;
    btnConfirm.classList.replace(
      "modal__btn-confirm-disabled",
      "modal__btn-confirm-enabled"
    );
  } else {
    btnConfirm.disabled = true;
    btnConfirm.classList.replace(
      "modal__btn-confirm-enabled",
      "modal__btn-confirm-disabled"
    );
  }

  btnConfirm.addEventListener("click", () => {
    if (modalMode === "create-grup-task" || modalMode === "edit-grup-task") {
      accept(modalMode, editGrup.containerTask);
    } else if (modalMode === "edit-task") {
      accept(modalMode, editGrup);
    } else if (modalMode === "create-task") {
      accept(modalMode);
    }
  });

  const btnCancel = document.createElement("button");
  btnCancel.type = "button";
  btnCancel.innerText = "Cancelar";
  btnCancel.title = "Cancelar (Escape)";

  btnCancel.addEventListener("click", () => {
    if (modalMode === "edit-grup-task" && Object.keys(editGrup).length !== 0) {
      cancel(modalMode, editGrup);
    } else if (
      modalMode === "edit-task" &&
      Object.keys(editGrup).length !== 0
    ) {
      cancel(modalMode, editGrup);
    } else {
      cancel();
    }
  });

  const continerConfirmBtns = document.createElement("div");
  continerConfirmBtns.classList.add("modal__confirm-btns");
  continerConfirmBtns.append(btnCancel, btnConfirm);

  const continerConfirm = document.createElement("article");
  continerConfirm.classList.add("modal__confirm");
  continerConfirm.appendChild(continerConfirmBtns);
  container.appendChild(containerInputs);
  if (modalMode === "create-grup-task" || modalMode === "edit-grup-task") {
    container.appendChild(containerAddBtn);
  }
  container.appendChild(continerConfirm);

  if (
    (modalMode === "edit-task" || modalMode === "edit-grup-task") &&
    Object.keys(editGrup).length !== 0
  ) {
    list.replaceChild(container, list.children[editGrup.containerTask]);
  } else {
    list.appendChild(container);
  }

  modalKeyListener = createModalKeyListener(modalMode, editGrup);

  document.addEventListener("keydown", modalKeyListener);
}

function createModalKeyListener(modalMode, editGrup) {
  return function (event) {
    switch (modalMode) {
      case "create-task":
        handleModalKeydown(event, modalMode);
        break;
      case "edit-task":
      case "create-grup-task":
      case "edit-grup-task":
        handleModalKeydown(event, modalMode, editGrup);
        break;
    }
  };
}

function handleModalKeydown(event, modalMode, editGrup) {
  const modal = document.querySelector(".modal");

  if (modal === null) return;

  const isModalConfirmButtonEnabled = modal
    .querySelector("#btn-accept")
    .classList.contains("modal__btn-confirm-enabled");

  if (
    modalMode.endsWith("grup-task") &&
    event.ctrlKey &&
    event.key === "Enter"
  ) {
    addInput();
  } else if (event.key === "Escape") {
    if (
      (modalMode === "edit-grup-task" || modalMode === "edit-task") &&
      Object.keys(editGrup).length !== 0
    ) {
      cancel(modalMode, editGrup);
    } else {
      cancel();
    }
  } else if (event.key === "Enter" && isModalConfirmButtonEnabled) {
    switch (modalMode) {
      case "create-task":
        accept(modalMode);
        break;
      case "edit-task":
        accept(modalMode, editGrup);
        break;
      case "create-grup-task":
      case "edit-grup-task":
        accept(modalMode, editGrup.containerTask);
        break;
    }
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

function cancel(modalMode, taks) {
  const modal = document.querySelector(".modal");
  if (taks !== undefined && modalMode === "edit-grup-task") {
    let arrayTask = [];
    Object.keys(taks).forEach((key) => {
      if (key !== "title" && key !== "containerTask") {
        arrayTask.push(taks[key]);
      }
    });
    createGroup(taks.title, arrayTask, taks.containerTask);
  } else if (taks !== undefined && modalMode === "edit-task") {
    createTask(taks.task1, taks.containerTask);
  } else {
    modal.remove();
  }
  if (modalKeyListener) {
    document.removeEventListener("keydown", modalKeyListener);
    modalKeyListener = null;
  }
  containerBtnAddTask.style.display = "block";
}
function accept(modalMode, containerTask) {
  const modal = document.querySelector(".modal");
  if (modalMode === "create-grup-task" || modalMode === "edit-grup-task") {
    const modalInputs = modal.querySelectorAll("input");
    let title;
    const tasks = [];

    modalInputs.forEach((input, index) => {
      if (index < 1) {
        title = input.value;
      } else {
        if (input.value !== "") {
          tasks.push(input.value);
        }
      }
    });
    if (modalMode === "create-grup-task") {
      createGroup(title, tasks);
    } else {
      editGrup(containerTask, title, tasks);
    }
  } else if (modalMode === "edit-task") {
    const description = modal.querySelector("input").value;
    editTask(description, containerTask.containerTask);
  } else if (modalMode === "create-task") {
    const description = modal.querySelector("input").value;
    createTask(description);
  }
  modal.remove();
  if (modalKeyListener) {
    document.removeEventListener("keydown", modalKeyListener);
    modalKeyListener = null;
  }
  containerBtnAddTask.style.display = "block";
}
function deleteInput(e) {
  const deleteInput = e.currentTarget.parentElement;
  deleteInput.remove();
}
function deleteTask(task) {
  task.remove();
}
function editTask(description, position) {
  createTask(description, position);
}
function editGrup(container, title, tasks) {
  const index = container;
  createGroup(title, tasks, index);
}
function showTasks() {}

function setAcceptButtonEnabled(enabled) {
  const btn = document.querySelector(".modal #btn-accept");

  if (enabled) {
    btn.disabled = true;
    btn.classList.replace(
      "modal__btn-confirm-enabled",
      "modal__btn-confirm-disabled"
    );
  } else {
    btn.disabled = false;
    btn.classList.replace(
      "modal__btn-confirm-disabled",
      "modal__btn-confirm-enabled"
    );
  }
}

function deleteConfirmationDialog(task, itemType) {
  if (document.querySelector("#confirmationModal")) return;
  const config = {
    Tarea: "la",
    Grupo: "el",
  };

  const confirmationModal = `<section class="confirmationModal" id="confirmationModal" >
    <p class="confirmationModal__message">${config[itemType]} ${itemType} se eliminará permanentemente</p>
    <div class="confirmationModal__btns">
      <button class="confirmationModal__cancel">cancelar</button>
      <button class="confirmationModal__accept">aceptar</button>
    </div>
  </section>`;
  main.insertAdjacentHTML("beforeend", confirmationModal);

  const modal = main.querySelector("#confirmationModal");
  const cancelBtn = modal.querySelector(".confirmationModal__cancel");
  const acceptBtn = modal.querySelector(".confirmationModal__accept");

  cancelBtn.addEventListener("click", () => {
    removeConfirmationModal();
  });

  acceptBtn.addEventListener("click", () => {
    deleteTask(task);
    removeConfirmationModal();
  });
}
function removeConfirmationModal() {
  main.querySelector("#confirmationModal")?.remove();
}

function focusInput(input) {
  setTimeout(() => {
    input.focus();
  }, 0);
}

function addInput(text) {
  const adderContainer = document.createElement("div");
  adderContainer.classList.add("modal__adder-container");

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("modal__adder-input");
  input.placeholder = "Descripcion";
  input.size = 100;
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
  const containerInputs = document
    .querySelector(".modal")
    .querySelector(".modal__inputs");

  containerInputs.appendChild(adderContainer);
}
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
//  como desarrollar software con cursor (IA)

// los imput tiene que poder tner saltos de linea y ser un poco mas largo (opcional)
// hay que verificar que los inputs no esten vacios o si estan vacios que no creee nada
//
