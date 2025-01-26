<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const tasks = ref([]);
const editing = ref(false);

onMounted(async () => {
  let token = localStorage.getItem("token");
  if(!token){
    alert("Niste prijavljeni!");
    window.location.href = "/login";
    return;
  }
  try{
    const response = await axios.get("http://localhost:8000/tasks", {
      headers: {
        Authorization: token,
      },
    });
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
    const response = await axios.get("http://localhost:8000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    tasks.value = response.data;
    console.log("Zadaci osvježeni:", response.data);
  } catch(error){
    console.error("Greška u dohvaćanju:", error);
  }
}

async function markAsCompleted(taskId){
  try{
    await axios.patch(`http://localhost:8000/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const task = tasks.value.find(task => task._id === taskId);
    if(task){
      task.zavrsen = true;
    }
  } catch(error){
    console.error("Greška u označavanju:", error);
    alert("Zadatak nije označen!");
  }
}

async function deleteTask(taskId){
  const isConfirmed = window.confirm("Želite li obrisati zadatak?");
  if(isConfirmed){
    try{
      await axios.delete(`http://localhost:8000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      tasks.value = tasks.value.filter(task => task._id !== taskId); 
    } catch(error){
      console.error("Greška u brisanju:", error);
      alert("Zadatak nije obrisan!");
    }
  }
}
</script>

<template>
  <router-view />
</template>

<style scoped></style>