import createGroup, {
  setCreateTaskCallback as setCreateTaskCallbackGroup,
  setModalCallback as setModalCallbackGroup,
} from "./components/createGroup.js";
import createTask, {
  setModalCallback as setModalCallbackTask,
} from "./components/createTask.js";

import {
  setCreateTaskCallback as setCreateTaskCallbackModal,
  setCreateGroupCallback as setCreateTaskGroupCallbackModal,
} from "./components/modal.js";
import modal from "./components/modal.js";
import {
  setCreateTaskCallback as setCreateTaskCallbackServices,
  setCreateGroupCallback as setCreateGroupCallbackServices,
} from "./services/todoService.js";
const btnAddGrup = document.getElementById("btn-create-grup-tasks");
const btnAddTask = document.getElementById("btn-create-task");

// configuracion del modal
setCreateTaskCallbackModal(createTask);
setCreateTaskGroupCallbackModal(createGroup);

// configuracion de createTask
setModalCallbackTask(modal);

// configuracion de createGroup
setCreateTaskCallbackGroup(createTask);
setModalCallbackGroup(modal);

// configuracion de services
setCreateTaskCallbackServices(createTask);
setCreateGroupCallbackServices(createGroup);

btnAddGrup.addEventListener("click", () => {
  modal("create-grup-task");
});

btnAddTask.addEventListener("click", () => {
  modal("create-task");
});
