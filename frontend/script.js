//Done without local storage

// function addTask(){
//     const taskInput = document.getElementById('taskInput');
//     const taskText = taskInput.value.trim();

//     if(taskText === '') return;

//     //create elements
//     const li = document.createElement('li');
//     const taskContent = document.createElement('div');
//     taskContent.classList.add('task-content');

//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';

//     const span = document.createElement('span');

//     span.textContent = taskText;
//     span.onclick = () => li.classList.toggle('completed');

//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = 'Delete';

//     //add event: toggle completed
//     checkbox.addEventListener('change',() =>{
//         if(checkbox.checked){
//             li.classList.add('completed');
//         }else{
//             li.classList.remove('completed')
//         }
//     });

//     //Add event Delete task
//     deleteBtn.addEventListener('click',() =>{
//         li.remove()
//     });

//     //Assemble DOM
//     taskContent.appendChild(checkbox);
//     taskContent.appendChild(span);
//     li.appendChild(taskContent);
//     li.appendChild(deleteBtn);

//     //append to task list
//     document.getElementById('taskList').appendChild(li);

//     //clear input
//     taskInput.value = "";
// }

//Done with local storage and edit button functionality added as well

// let tasks = [];

// //load tasks from localstorage on pageload
// window.onload = function() {
//     const savedTasks = localStorage.getItem('todoTasks');
//     if(savedTasks){
//     tasks = JSON.parse(savedTasks);
//     tasks.forEach(task => renderTask(task));
//     }
// };

// function addTask(){
//     const taskInput = document.getElementById('taskInput');
//     const taskText = taskInput.value.trim()

//     if(taskText === '') return;

//     const newTask = {
//         id: Date.now(),
//         text: taskText,
//         completed: false
//     };

//     tasks.push(newTask);
//     savedTasks();
//     renderTask(newTask);
//     taskInput.value = '';
// }

// function renderTask(task){
//     const li = document.createElement('li');
//     if(task.completed) li.classList.add('completed');

//     const taskContent = document.createElement('div');
//     taskContent.classList.add('task-content');

//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.checked = task.completed;

//     checkbox.addEventListener('change',() =>{
//         task.completed = checkbox.checked;
//         if(task.completed){
//             li.classList.add('completed');
//         }
//         else{
//             li.classList.remove('completed');
//         }
//         savedTasks();
//     });

//     const span = document.createElement('span');
//     span.textContent = task.text;

//     const input = document.createElement('input');
//     input.type = 'text';
//     input.style.display = 'none';

//     const editBtn = document.createElement('button');
//     editBtn.classList.add('action-btn');
//     editBtn.textContent = 'Edit';

//     editBtn.addEventListener('click',() =>{
//         if(editBtn.textContent === 'Edit'){
//             input.value = task.text;
//             span.style.display = 'none';
//             input.style.display = 'inline';
//             editBtn.textContent = 'Save';
//         }else{
//             const updatedText = input.value.trim();
//             if(updatedText){
//                 task.text = updatedText;
//                 span.textContent = updatedText;
//                 savedTasks();
//             }
//             span.style.display = 'inline';
//             input.style.display = 'none';
//             editBtn.textContent = 'Edit'
//         }
//     });

//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = 'Delete';
//     deleteBtn.addEventListener('click',() =>{
//         tasks = tasks.filter(t => t.id !== task.id);
//         li.remove();
//         savedTasks();
//     });

//     taskContent.appendChild(checkbox);
//     taskContent.appendChild(span);
//     taskContent.appendChild(input);
//     li.appendChild(taskContent);
//     li.appendChild(editBtn);
//     li.appendChild(deleteBtn);
//     document.getElementById('taskList').appendChild(li);
// }
// function savedTasks(){
//     localStorage.setItem('todoTasks',JSON.stringify(tasks));
// }

//Now connecting backend with frontend and modifying the APIs with fetch

const API_URL = "http://localhost:5000/api/tasks";
let tasks = [];

window.onload = async function () {
  const res = await fetch(API_URL);
  tasks = await res.json();
  tasks.forEach((task) => renderTask(task));
};

async function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const newTask = {
    text: taskText,
    completed: false,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  const createdTask = await res.json();
  tasks.push(createdTask);
  renderTask(createdTask);
  taskInput.value = "";
}

function renderTask(task) {
  const taskList = document.getElementById("taskList");
  const li = document.createElement("li");
  li.className = "task-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.className = "task-checkbox";

  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.completed) span.classList.add("completed");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";

  checkbox.addEventListener("change", async () => {
    task.completed = checkbox.checked;
    span.classList.toggle("completed", task.completed);

    await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
  });

  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      span.textContent = task.text;

      fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
    }
  });

  deleteBtn.addEventListener("click", async () => {
    await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
    tasks = tasks.filter((t) => t._id !== task._id);
    li.remove();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}
