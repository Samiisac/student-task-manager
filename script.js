const STORAGE_KEY = "student-task-manager-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");

let tasks = loadTasks();

function loadTasks() {
	try {
		const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		return Array.isArray(savedTasks)
			? savedTasks.filter((task) => task && typeof task.id === "string" && typeof task.text === "string")
			: [];
	} catch {
		return [];
	}
}

function saveTasks() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
	taskList.replaceChildren();
	emptyState.hidden = tasks.length > 0;

	tasks.forEach((task) => {
		const item = document.createElement("li");
		item.className = "task-item";
		item.classList.toggle("is-complete", Boolean(task.completed));

		const checkbox = document.createElement("input");
		checkbox.className = "task-checkbox";
		checkbox.type = "checkbox";
		checkbox.checked = Boolean(task.completed);
		checkbox.setAttribute("aria-label", `Marker ${task.text} som fullført`);
		checkbox.addEventListener("change", () => {
			task.completed = checkbox.checked;
			saveTasks();
			renderTasks();
		});

		const text = document.createElement("span");
		text.className = "task-text";
		text.textContent = task.text;

		const deleteButton = document.createElement("button");
		deleteButton.className = "delete-button";
		deleteButton.type = "button";
		deleteButton.textContent = "Slett";
		deleteButton.setAttribute("aria-label", `Slett ${task.text}`);
		deleteButton.addEventListener("click", () => {
			tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
			saveTasks();
			renderTasks();
		});

		item.append(checkbox, text, deleteButton);
		taskList.append(item);
	});
}

taskForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const text = taskInput.value.trim();
	if (!text) return;

	tasks.push({ id: crypto.randomUUID(), text, completed: false });
	saveTasks();
	renderTasks();
	taskForm.reset();
	taskInput.focus();
});

renderTasks();
