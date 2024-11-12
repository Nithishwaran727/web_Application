'use strict'
const containert = document.querySelector(".containerT")
const task = document.getElementById('task');
const todoAlert =document.getElementById('TodoAlert'); 
const todoList = document.getElementById('list-item');
const EditTask = document.getElementById('EditTask');
const customalert = document.getElementById('customAlertBox');
const updateTask = document.getElementById('updateTask');

//This step are get current date and time 
const date = new Date();

function dateNow(){
const day = date.getDate();
const month = date.getMonth();
const year = date.getFullYear(); 
const currentdate = `${day}/${month}/${year}`;
return currentdate;
}

function TimeNow(){
var hour = date.getHours();
var minutes = date.getMinutes();
const ampm = hour >= 12 ? 'PM' : 'AM';
hour = hour % 12;
hour = hour ? hour : 12; // the hour '0' should be '12'
minutes = minutes < 10 ? '0' + minutes : minutes;
const currenttime = hour + ':' + minutes + ' ' + ampm;
return currenttime;
}
//get data from api
var updata;
 var data = []; // Corrected to accumulate tasks, not overwrite

 
 // Call the function to execute it delete task

 /*
 async function listOutTask() {
    const api = 'https://66d5848df5859a7042665f61.mockapi.io/ToDo';
    
    try {
        const response = await fetch(api);
        const taskD = await response.json();
        containert.querySelector("#list-item").innerHTML = ''; // Clear existing tasks

        
        taskD.forEach(datas => {
            const li = document.createElement("li");
            li.setAttribute('id', 'task' + `${datas.id}`);

            const dateORtime = (currentdate === `${datas.date}`) ? `${datas.time}` : `${datas.date}`;

            const todoitem = `
                <div title="Hit Double Click to Complete" class="taskdiv" ondblclick="CompletedToDoItems(${datas.id})">
                    <img src="../images/checked.png" title="Task completed" class="checkicon">
                    ${datas.Task}
                </div>
                <div class="date">${dateORtime}</div>
                <div>
                    <img class="edit todo-controls" title="Edit" onclick='UpdateToDoItems(${datas.id})' src='../images/edit.png'/>
                    <img class="delete todo-controls" title="Delete" onclick='DeleteToDoItems(${datas.id})' src="../images/Delete.png" />
                </div>
            `;
            li.innerHTML = todoitem;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        todoAlert.style.color = 'red';
        todoAlert.innerHTML = "Error fetching tasks.";
    }
}

 // Log data after fetching // Delay to ensure data is fetched before logging
listOutTask(); 
*/
task.addEventListener("keydown",function(e){
    if(e.keyCode==13){
        addTask();
    }
 })
//add task in the api
function addTask(){
    var IsPersent = false;
    if (task.value === ""){
        todoAlert.style.color= 'red';
        todoAlert.innerHTML = "Please Enter your daily task.";
        task.focus()
        IsPersent=true;

    }
    if(!IsPersent){
    //ge the current date
   
   //console.log(currentdate)
   //console.log(currenttime);
    const taskData = {
        Task:task.value,
        date:dateNow(),
        time:TimeNow(),
    }
    console.log(taskData);
    //it not persent in list it we add

    var api = 'https://66d5848df5859a7042665f61.mockapi.io/ToDo';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', api, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                console.log("Task added in list successfully.");
                listOutTask()
                task.value=" ";
                task.focus();
                todoAlert.style.color = "green";
                todoAlert.innerHTML = "Task added in list successfully.";
                setTimeout(function() {
                    todoAlert.innerHTML="";
                }, 4000);
            } else {
                console.log("Error:", xhr.status);
                todoAlert.style.color = 'red';
                todoAlert.innerHTML = "Task added option was failed.";
                task.focus();
                setTimeout(function() {
                    todoAlert.innerHTML = "";
                }, 4000);
            }
        }
    };
    
    // Assuming taskData is defined somewhere in your code
    xhr.send(JSON.stringify(taskData));
    console.log(taskData);
}
}

function listOutTask() {
    var api = 'https://66d5848df5859a7042665f61.mockapi.io/ToDo';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', api, true);

    xhr.onreadystatechange = function () {
        try {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var taskD = JSON.parse(xhr.responseText);

                // Clear the container before appending new tasks
                containert.querySelector('#list-item').innerHTML = "";

                // Reset the data array to hold all tasks
                data = [];

                // Loop through each task and add to the UI
                taskD.forEach(datas => {
                    data.push(datas); // Store each task in the data array
                    
                    var li = document.createElement("li");
                    li.setAttribute('id', 'task' + `${datas.id}`);

                    const dateORtime = (dateNow() == `${datas.date}`) ? `${datas.time}` : `${datas.date}`;
                    console.log(dateORtime);

                    var todoitem = `
                        <div  title="Hit Double Click and Complete" id="taskdiv" class="taskdiv" ondblclick="CompletedToDoItems(${datas.id})">
                            <img src="../images/checked.png" title="Task completed" class="checkicon">
                            ${datas.Task}
                        </div>
                        <div class="date" title ='${datas.date} ${datas.time}'>${dateORtime}</div>
                        <div>
                            <img class="edit todo-controls" type="button" id="updatebtn" title="Edit" onclick='UpdateToDoItems(${datas.id})' src='../images/edit.png'/>
                            <img class="delete todo-controls" onclick='DeleteToDoItems(${datas.id})' title="Delete" src="../images/Delete.png" />
                        </div>`;
                    
                        li.innerHTML = todoitem;
                        todoList.appendChild(li); // Append the task to the list
                        console.log(todoList);
                    }
                )

                // After rendering the tasks, apply saved styles for completed tasks
                data.forEach(d => {
                    const liid = document.getElementById(`task${d.id}`);
                    console.log("id", d.id);
                    const savedStyle = localStorage.getItem(`task${d.id}Style`);
                    if (savedStyle) {
                        liid.querySelector('.taskdiv').style.textDecoration = savedStyle;
                        if (savedStyle === 'line-through solid 2px') {
                            liid.querySelector('img.edit').style.display = "none";
                            liid.querySelector('.checkicon').style.display = "inline";
                            liid.classList.add("addclass");
                        } else {
                            liid.querySelector('.taskdiv').style.textDecoration = "none";
                            liid.querySelector('img.edit').style.display = "inline";
                            liid.querySelector('.checkicon').style.display = "none";
                            liid.classList.remove("addclass");
                        }
                    }
                });
            }
            if (todoList.childElementCount == 0){
                var h3 = document.createElement('h3');
                h3.classList = 'noTask';
                h3.setAttribute('id','noTask');
                h3.innerHTML = "No Task found";
                h3.style.display = 'block';
                todoList.appendChild(h3); // Append the task to the list
            } 
        } catch (error) {
            console.error('Error fetching tasks:', error);
            todoAlert.style.color = 'red';
            todoAlert.innerHTML = "Error fetching tasks.";
        }
    };

    xhr.send();
}

// Call the function to load the tasks initially
listOutTask();


 

//get from api and  list out Task in webpage

async function DeleteToDoItems(id){
    try{
        const response =await( fetch(`https://66d5848df5859a7042665f61.mockapi.io/ToDo/${id}`,{
            method:'DELETE',
        }));
        if (response.ok){
            listOutTask()
            console.log("Task Delete successfull");
            todoAlert.style.color = "red";
            todoAlert.innerHTML = "Task Delete successfull";
            setTimeout(function() {
                todoAlert.innerHTML = "";
            }, 4000);
            localStorage.removeItem(`task${id}Style`);
        }
        else{
            
            console.log("can't delete task");
            todoAlert.style.color = "red";
            todoAlert.innerHTML = "can't delete task";
            setTimeout(function() {
                todoAlert.innerHTML = "";
            }, 4000)
        }
    }
    catch{
        console.error("Error:",response.status);
        todoAlert.style.color = "red";
        todoAlert.innerHTML="Task Deletetion failed.";
        setTimeout(function() {
            todoAlert.innerHTML = "";        
        }, 4000);
    }
}


function displayalert(){
    customalert.style.display ='block';
}

//using for cancel editing 
function updatecancel(){

    if (confirm("Are you sure Cancel?")==true){
        customalert.style.display = 'none';
        EditTask.value = "";
   }
}

//update task 
function UpdateToDoItems(id){
 
    fetch(`https://66d5848df5859a7042665f61.mockapi.io/ToDo/${id}`)
    .then(response => response.json())
    .then(json => {
        updata = json.Task;
         // Moved inside the then block
         EditTask.value = updata;
         EditTask.focus();
             
    })
    .catch(error => {
        console.error("Error: ", error);
        alert("Can't get data from API."); // Moved inside the catch block
    });
   
        displayalert(); 
    updateTask.addEventListener("click",function(){
         var Taskdata={
            Task:EditTask.value,
            date:dateNow(),
            time:TimeNow(),
         }
        var url = (`https://66d5848df5859a7042665f61.mockapi.io/ToDo/${id}`)
        const xhr = new XMLHttpRequest;
        xhr.open('PUT',url,true);
        xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');

        xhr.onreadystatechange =function (){
              if(xhr.readyState === 4 && xhr.status===200){
                listOutTask();
                customalert.style.display = 'none';
                console.log("updated succssfully");
                todoAlert.innerHTML="update task successfully"; 
                setTimeout(function() {
                    todoAlert.innerHTML="";
                }, 4000)
                }
              else if (xhr.readyState===4){
                todoAlert.innerHTML="failed update employee."; 
                setTimeout(function() {
                    todoAlert.innerHTML="";
                }, 4000)
              }
        };      

        xhr.send(JSON.stringify(Taskdata));

  });         
}
/*
async function getTask() { 
    fetch("https://66d5848df5859a7042665f61.mockapi.io/ToDo")
        .then(response => response.json())
        .then(json => {
            data = json; // Declare data inside the then block
            data.forEach(d => {
                const liid = document.getElementById(`task${d.id}`);
                console.log("id", d.id);
                const savedStyle = localStorage.getItem(`task${d.id}Style`);
                if (savedStyle) {
                    liid.querySelector('.taskdiv').style.textDecoration = savedStyle;
                    if (savedStyle === 'line-through solid 3px #247a12ea') { 
                        liid.querySelector('img.edit').style.display = "none";
                        liid.querySelector('.checkicon').style.display = "inline";
                        liid.classList.add("addclass");
                    } else {
                        liid.querySelector('.taskdiv').style.textDecoration = "none";
                        liid.querySelector('img.edit').style.display = "inline";
                        liid.querySelector('.checkicon').style.display = "none";
                        liid.classList.remove("addclass");
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error: ", error);
            alert("Can't get data from API."); // Moved inside the catch block
        });
}

getTask();*/ // Call the function to fetch data


// displayalert custom alert box for edit task
//completed tsak function
function CompletedToDoItems(id) {
    console.log(data);
    data.forEach(d => {
        if (d.id == id) {
            const liid = document.getElementById(`task${id}`);
            //console.log( "div",liid);
            if (liid.classList.contains("addclass")) {
                liid.classList.remove("addclass");
                liid.querySelector(".taskdiv").style.textDecoration = "none";
                localStorage.setItem(`task${id}Style`, "none");//stroage the style in name of ex (task1Style) 
                liid.querySelector('img.edit').style.display="inline";
                liid.querySelector('.checkicon').style.display="none";
                
            } else {
                liid.classList.add("addclass");
                liid.querySelector('.taskdiv').style.textDecoration = "line-through solid 2px  ";
                localStorage.setItem(`task${id}Style`, "line-through solid 2px");//stroage the style in name of ex (task1Style)
                liid.querySelector('img.edit').style.display='none';
                liid.querySelector('.checkicon').style.display="inline";
            }
        }
    });
}
/*
function CompletedToDoItems(id){
    data.forEach(d => {
        if (d.id == id) {
            const liid = document.getElementById(`task${id}`);
            console.log(liid);
            if (liid.classList.contains("addclass")) {
                liid.classList.remove("addclass");
                liid.style.color = "black"   
                localStorage.setItem(`task${id}Style`, "none");      
                liid.querySelector('img.edit').style.display="inline";
                liid.querySelector('.checkicon').style.display="none";   
            }
            else{
                liid.classList.add("addclass");
                //liid.style.textDecoration = "line-through";
                liid.querySelector('#completeTask').innerHTML = "Completed";  
                liid.style.color = "#247a12ea"   
                localStorage.setItem(`task${id}Style`, "#247a12ea");
                liid.querySelector('img.edit').style.display='none';
                liid.querySelector('.checkicon').style.display="inline"; 
            }
        
    }})
}

// Apply style on page load


*/
//this function activate at the time of load the page
 
function loader() {
    
    document.querySelector(".containerL").style.visibility = "visible";

    setTimeout(()=>{document.querySelector(".containerL").style.display = "none"},5000)
};

loader();
