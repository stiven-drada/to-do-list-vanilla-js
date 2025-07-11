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

// ("por que se pierde el modalMOde");
