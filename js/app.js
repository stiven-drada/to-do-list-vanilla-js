import modal from "./components/modal.js";
const btnAddGrup = document.getElementById("btn-create-grup-tasks");
const btnAddTask = document.getElementById("btn-create-task");

btnAddGrup.addEventListener("click", () => {
  modal("create-grup-task");
});

btnAddTask.addEventListener("click", () => {
  modal("create-task");
});
