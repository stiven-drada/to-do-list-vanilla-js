const main = document.querySelector(".container-main");
export let auxiliar;
export let modalKeyListener;
import createGroup from "../components/createGroup.js";
import createTask from "../components/createTask.js";
const containerBtnAddTask = document.querySelector(".container-create-task");

export function deleteTask(task) {
  task.remove();
}
export function editTask(description, position) {
  createTask(description, position);
}
export function editGrup(container, title, tasks) {
  const index = container;
  createGroup(title, tasks, index);
}

export function deleteConfirmationDialog(task, itemType) {
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
export function removeConfirmationModal() {
  main.querySelector("#confirmationModal")?.remove();
}

export function cancel(modalMode, taks) {
  const modalContainer = document.querySelector(".modal");
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
    modalKeyListener = null;
  }
  containerBtnAddTask.style.display = "block";
}
export function setmodalKeyListener(newValue) {
  modalKeyListener = newValue;
}
export function setAuxiliar(newValue) {
  auxiliar = newValue;
}
