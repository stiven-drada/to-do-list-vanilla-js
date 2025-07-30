import createTask from "./createTask.js";
import createGroup from "./createGroup.js";
import {
  editTask,
  editGrup,
  modalKeyListener,
  setmodalKeyListener,
} from "../services/todoService.js";
const list = document.getElementById("list");
const containerBtnAddTask = document.querySelector(".container-create-task");

function modal(modalMode, itemToEdit = {}) {
  if (modalKeyListener) {
    document.removeEventListener("keydown", modalKeyListener);
    setmodalKeyListener(null);
  }

  containerBtnAddTask.style.display = "none";

  function cancel(modalMode, taks) {
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
      modalContainer.remove();
    }
    if (modalKeyListener) {
      document.removeEventListener("keydown", modalKeyListener);
      setmodalKeyListener(null);
    }
    containerBtnAddTask.style.display = "block";
  }

  function accept(modalMode, containerTask) {
    if (modalMode === "create-grup-task" || modalMode === "edit-grup-task") {
      const modalInputs = modalContainer.querySelectorAll("input,textarea");
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
      const description = modalContainer.querySelector("textarea").value;
      editTask(description, containerTask.containerTask);
    } else if (modalMode === "create-task") {
      const description = modalContainer.querySelector("textarea").value;
      createTask(description);
    }
    modalContainer.remove();
    if (modalKeyListener) {
      document.removeEventListener("keydown", modalKeyListener);
      setmodalKeyListener(null);
    }
    containerBtnAddTask.style.display = "block";
  }

  function addInput(text, container) {
    const adderContainer = document.createElement("div");
    adderContainer.classList.add("modal__adder-container");

    const input = document.createElement("textarea");
    input.style.resize = "none";
    input.classList.add("modal__adder-input");
    input.rows = 3;
    input.placeholder = "Descripcion";
    if (text) {
      input.value = text;
    }

    const deleteAdderBtn = document.createElement("button");
    deleteAdderBtn.type = "button";
    deleteAdderBtn.title = "eliminar tarea";
    deleteAdderBtn.classList.add("modal__adder-btn");
    deleteAdderBtn.innerText = "X";
    deleteAdderBtn.addEventListener("click", deleteInput);
    let containerInputs;
    adderContainer.append(input, deleteAdderBtn);
    if (container !== undefined) {
      containerInputs = container;
    } else {
      containerInputs = modalContainer.querySelector(".modal__inputs");
    }

    containerInputs.appendChild(adderContainer);
  }

  function deleteInput(e) {
    const deleteInput = e.currentTarget.parentElement;
    deleteInput.remove();
  }

  function setAcceptButtonEnabled(enabled) {
    if (enabled) {
      btnConfirm.disabled = true;
      btnConfirm.classList.replace(
        "modal__btn-confirm-enabled",
        "modal__btn-confirm-disabled"
      );
    } else {
      btnConfirm.disabled = false;
      btnConfirm.classList.replace(
        "modal__btn-confirm-disabled",
        "modal__btn-confirm-enabled"
      );
    }
  }

  function focusInput(input) {
    setTimeout(() => {
      input.focus();
    }, 0);
  }

  function createModalKeyListener(modalMode, itemToEdit) {
    return function (event) {
      switch (modalMode) {
        case "create-task":
          handleModalKeydown(event, modalMode);
          break;
        case "edit-task":
        case "create-grup-task":
        case "edit-grup-task":
          handleModalKeydown(event, modalMode, itemToEdit);
          break;
      }
    };
  }

  function handleModalKeydown(event, modalMode, itemToEdit) {
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
        Object.keys(itemToEdit).length !== 0
      ) {
        cancel(modalMode, itemToEdit);
      } else {
        cancel();
      }
    } else if (
      event.shiftKey &&
      event.key === "Enter" &&
      isModalConfirmButtonEnabled
    ) {
      switch (modalMode) {
        case "create-task":
          accept(modalMode);
          break;
        case "edit-task":
          accept(modalMode, itemToEdit);
          break;
        case "create-grup-task":
        case "edit-grup-task":
          accept(modalMode, itemToEdit.containerTask);
          break;
      }
    }
  }

  const modalContainer = document.createElement("section");
  let mode = modalMode.startsWith("create") ? "modal--create" : "modal--edit";
  modalContainer.classList.add("modal", mode);

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

  const inputDescription = document.createElement("textarea");
  inputDescription.rows = 3;
  inputDescription.style.resize = "none";
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
    if (
      modalMode === "edit-grup-task" &&
      Object.keys(itemToEdit).length !== 0
    ) {
      inputTitle.value = itemToEdit.title;
    }
    containerInputs.appendChild(inputTitle);
  }
  if (
    (modalMode === "edit-task" || modalMode === "edit-grup-task") &&
    itemToEdit.task1?.length > 0
  ) {
    inputDescription.value = itemToEdit.task1;
  }
  containerInputs.appendChild(inputDescription);

  if (modalMode === "edit-grup-task" && Object.keys(itemToEdit).length !== 0) {
    const task = Object.keys(itemToEdit);
    if (task.length > 2) {
      for (let i = 2; i < task.length; i++) {
        let key = task[i];
        let text = itemToEdit[key];
        if (key !== "containerTask") {
          addInput(text, containerInputs);
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
  btnConfirm.title = "Confirmar (Shift + Enter)";
  if (Object.keys(itemToEdit).length !== 0) {
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
      accept(modalMode, itemToEdit.containerTask);
    } else if (modalMode === "edit-task") {
      accept(modalMode, itemToEdit);
    } else if (modalMode === "create-task") {
      accept(modalMode);
    }
  });

  const btnCancel = document.createElement("button");
  btnCancel.type = "button";
  btnCancel.innerText = "Cancelar";
  btnCancel.title = "Cancelar (Escape)";

  btnCancel.addEventListener("click", () => {
    if (
      modalMode === "edit-grup-task" &&
      Object.keys(itemToEdit).length !== 0
    ) {
      cancel(modalMode, itemToEdit);
    } else if (
      modalMode === "edit-task" &&
      Object.keys(itemToEdit).length !== 0
    ) {
      cancel(modalMode, itemToEdit);
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
  modalContainer.appendChild(containerInputs);
  if (modalMode === "create-grup-task" || modalMode === "edit-grup-task") {
    modalContainer.appendChild(containerAddBtn);
  }
  modalContainer.appendChild(continerConfirm);

  if (
    (modalMode === "edit-task" || modalMode === "edit-grup-task") &&
    Object.keys(itemToEdit).length !== 0
  ) {
    list.replaceChild(modalContainer, list.children[itemToEdit.containerTask]);
  } else {
    list.appendChild(modalContainer);
  }

  setmodalKeyListener(createModalKeyListener(modalMode, itemToEdit));

  document.addEventListener("keydown", modalKeyListener);
}

export default modal;
