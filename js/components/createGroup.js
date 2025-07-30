import { auxiliar, setAuxiliar } from "../services/todoService.js";
import modal from "./modal.js";
import createTask from "./createTask.js";
import { deleteConfirmationDialog, cancel } from "../services/todoService.js";
function createGroup(title, tasks, position) {
  function toggleTask(e) {
    const isOpen = e.currentTarget.classList.toggle("open");
    const ul = e.currentTarget.closest(".list__item--grup").querySelector("ul");

    if (isOpen) {
      e.currentTarget.innerHTML = `<i class="fa-solid fa-caret-down"></i>`;
      e.currentTarget.title = "Cerrar";
      ul.classList.remove("list--grup-off");
      ul.classList.add("list--grup-on");
    } else {
      e.currentTarget.innerHTML = '<i class="fa-solid fa-caret-right"></i>';
      e.currentTarget.title = "Abrir";
      ul.classList.remove("list--grup-on");
      ul.classList.add("list--grup-off");
    }
  }
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const btnToggleTask = document.createElement("button");
  btnToggleTask.id = "btnToggleTask";
  btnToggleTask.title = "Abrir";
  btnToggleTask.innerHTML = '<i class="fa-solid fa-caret-right"></i>';
  btnToggleTask.addEventListener("click", toggleTask);

  const span = document.createElement("span");
  span.classList.add("task-title");
  span.innerText = title;

  const btnEdit = document.createElement("button");
  btnEdit.title = "Editar grupo";
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
      setAuxiliar(grupTask);
      modal("edit-grup-task", grupTask);
    } else if (document.querySelector(".modal")) {
      if (auxiliar.title?.length) {
        cancel("edit-grup-task", auxiliar);
      } else {
        cancel("edit-task", auxiliar);
      }
      setAuxiliar(grupTask);
      modal("edit-grup-task", grupTask);
    }
  });

  const btnDelete = document.createElement("button");
  btnDelete.title = "Eliminar grupo";
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

export default createGroup;
