<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Task from "./components/Task.vue";

let tasks = ref([]);
let editing = ref(false);

onMounted(async () => {
  try{
    const response = await axios.get("http://localhost:8000/tasks");
    tasks.value = response.data;
    console.log("Dohvaćeno:", response.data);
  } catch(error){
    console.error("Greška u dohvaćanju:", error);
  }
});

function dodajZadatak(task){
  tasks.value.unshift(task); 
  editing.value = false;

  fetchTasks();
}

async function fetchTasks(){
  try{
    const response = await axios.get("http://localhost:8000/tasks");
    tasks.value = response.data;
    console.log("Tasks refreshed:", response.data);
  } catch(error){
    console.error("Greška u dohvaćanju:", error);
  }
}

async function markAsCompleted(taskId){
  try{
    await axios.patch(`http://localhost:8000/tasks/${taskId}`);
    
    const task = tasks.value.find(task => task._id === taskId);
    if(task){
      task.zavrsen = true;
    }
  } catch(error){
    console.error("Error u označavanju:", error);
    alert("Zadatak nije označen!");
  }
}

async function deleteTask(taskId){
  const isConfirmed = window.confirm("Želite li obrisati zadatak?");
  
  if(isConfirmed){
    try{
      await axios.delete(`http://localhost:8000/tasks/${taskId}`);
      
      tasks.value = tasks.value.filter(task => task._id !== taskId); 
    } catch(error){
      console.error("Error u brisanju:", error);
      alert("Zadatak nije obrisan!");
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Header -->
    <header class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        @click="editing = true">
        Dodaj zadatak
      </button>
    </header>
    <!--/Header-->
    <Task v-if="editing" @saveTask="dodajZadatak" @cancel="editing = false" />
    <!-- Task List -->
    <div class="bg-white p-4 shadow rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
      <ul class="space-y-4">
        <!-- Task Item -->
        <li
          v-for="(task, index) in tasks"
          :key="task._id"
          :class="{ 'bg-green-100': task.zavrsen }"
          class="flex justify-between items-center p-4 rounded-md shadow">
          <div>
            <p class="text-lg font-medium text-gray-800">{{ task.naslov }}</p>
            <p class="text-sm text-gray-600">{{ task.opis }}</p>
            <div v-if="task.tags && task.tags.length" class="flex flex-wrap mt-2">
              <span
                v-for="(tag, i) in task.tags"
                :key="i"
                class="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs mr-2 mb-2">
                {{ tag }}
              </span>
            </div>
          </div>
          <!-- Task Actions -->
          <div class="flex space-x-2">
            <button
              v-if="!task.zavrsen"
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              @click="markAsCompleted(task._id)">
              Dovršeno
            </button>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              @click="deleteTask(task._id)">
              Obriši
            </button>
          </div>
          <!--/Task Actions-->
        </li>
        <!--/Task Item-->
      </ul>
    </div>
  </div>
</template>

<style scoped></style>