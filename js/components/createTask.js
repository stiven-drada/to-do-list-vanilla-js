import { auxiliar, setAuxiliar } from "../services/todoService.js";
import modal from "./modal.js";
import { deleteConfirmationDialog, cancel } from "../services/todoService.js";

function createTask(description, containerTask) {
  const li = document.createElement("li");
  li.classList.add("list__item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.classList.add("task-description");
  span.innerText = description;

  const divInfo = document.createElement("div");
  divInfo.classList.add("list__info");
  divInfo.append(checkbox, span);

  const btnEdit = document.createElement("button");
  btnEdit.title = "Editar tarea";
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
      setAuxiliar(task);
      modal("edit-task", task);
      document.querySelector(".modal").classList.add("open");
    } else if (document.querySelector(".modal")) {
      if (auxiliar.title?.length) {
        cancel("edit-grup-task", auxiliar);
      } else {
        cancel("edit-task", auxiliar);
      }

      setAuxiliar(task);
      modal("edit-task", task);
      document.querySelector(".modal").classList.add("open");
    }
  });

  const btnDelete = document.createElement("button");
  btnDelete.title = "Eliminar tarea";
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

export default createTask;
