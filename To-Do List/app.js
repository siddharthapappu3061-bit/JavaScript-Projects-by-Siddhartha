const taskName = document.getElementById("task-name");
const taskDate = document.getElementById("enter-date");
const taskTime = document.getElementById("enter-time");
const addTaskButton = document.getElementById("add-a-task");
const searchTask = document.getElementById("search-task");
const dueTasks = document.getElementById("due-tasks");
const upcomingTasks = document.getElementById("upcoming-tasks");
const errorMessage = document.getElementById("error-message");
const closeError = document.getElementById("close-error");
const editDialogBox = document.getElementById("edit-dialog-box");
const editDescription = document.getElementById("edit-description");
const editDate = document.getElementById("edit-date");
const editTime = document.getElementById("edit-time");
const saveEditButton = document.getElementById("save-edit");
const cancelEditButton = document.getElementById("cancel-edit");
let editingTaskId = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    let hour = Number(hours);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${String(hour).padStart(2, "0")}:${minutes} ${period}`;
}

const showError = () => {
    errorMessage.style.display = "flex";
}

const createTaskElement = (task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const description = document.createElement("p");
    description.classList.add("task-description");
    description.textContent = task.description;

    const time = document.createElement("span");
    time.classList.add("task-time");
    time.textContent = `at ${formatTime(task.time)}`;
    description.appendChild(time);

    const buttons = document.createElement("div");
    buttons.classList.add("task-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-task-btn");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-task-btn");

    editButton.addEventListener("click", () => {
        editTask(task.id);
    });

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);
    taskItem.appendChild(description);
    taskItem.appendChild(buttons);
    return taskItem;
}

const displayTasks = () => {
    dueTasks.innerHTML = "";
    upcomingTasks.innerHTML = "";
    const today = getToday();
    const searchText = searchTask.value.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.description.toLowerCase().includes(searchText)
    );

    const sortedTasks = filteredTasks.map(task => task);
    sortedTasks.sort((a, b) => {
        const dateA = `${a.date}T${a.time}`;
        const dateB = `${b.date}T${b.time}`;
        return dateA.localeCompare(dateB);
    });

    const dates = [];
    sortedTasks.forEach(task => {
        if (!dates.includes(task.date)) {
            dates.push(task.date);
        }
    });

    dates.forEach(date => {
        const daySection = document.createElement("div");
        daySection.classList.add("task-day");
        const dateHeading = document.createElement("h3");
        if (date === today) {
            dateHeading.textContent = "Today";
        } else {
            dateHeading.textContent = formatDate(date);
        }

        daySection.appendChild(dateHeading);
        const tasksForDate = sortedTasks.filter(task => task.date === date);
        tasksForDate.forEach(task => {
            const taskElement = createTaskElement(task);
            daySection.appendChild(taskElement);
        });

        if (date <= today) {
            dueTasks.appendChild(daySection);
        } else {
            upcomingTasks.appendChild(daySection);
        }
    });

    if (dueTasks.children.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-message");
        emptyMessage.textContent = "No due tasks found";
        dueTasks.appendChild(emptyMessage);
    }

    if (upcomingTasks.children.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-message");
        emptyMessage.textContent = "No upcoming tasks found";
        upcomingTasks.appendChild(emptyMessage);
    }
}

const addTask = () => {
    const description = taskName.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;
    if (!description || !date || !time) {
        showError();
        return;
    }
    errorMessage.style.display = "none";
    const newTask = {
        id: Date.now().toString(),
        description: description,
        date: date,
        time: time
    };

    tasks.push(newTask);
    saveTasks();
    taskName.value = "";
    taskDate.value = "";
    taskTime.value = "";
    displayTasks();
}

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

const editTask = (id) => {
    const task = tasks.filter(task => task.id === id)[0];
    if (!task) {
        return;
    }
    editingTaskId = id;
    editDescription.value = task.description;
    editDate.value = task.date;
    editTime.value = task.time;
    editDialogBox.style.display = "flex";
}

saveEditButton.addEventListener("click", () => {
    const updatedDescription = editDescription.value.trim();
    const updatedDate = editDate.value;
    const updatedTime = editTime.value;
    if (!updatedDescription || !updatedDate || !updatedTime) {
        alert("Please fill in all fields");
        return;
    }
    const task = tasks.filter(task => task.id === editingTaskId)[0];
    if (!task) {
        return;
    }
    task.description = updatedDescription;
    task.date = updatedDate;
    task.time = updatedTime;
    saveTasks();
    displayTasks();
    editDialogBox.style.display = "none";
    editingTaskId = null;
});

cancelEditButton.addEventListener("click", () => {
    editDialogBox.style.display = "none";
    editingTaskId = null;
});

editDialogBox.addEventListener("click", (event) => {
    if (event.target === editDialogBox) {
        editDialogBox.style.display = "none";
        editingTaskId = null;
    }
});

addTaskButton.addEventListener("click", addTask);
searchTask.addEventListener("input", displayTasks);
closeError.addEventListener("click", () => {
    errorMessage.style.display = "none";
});

displayTasks();