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
