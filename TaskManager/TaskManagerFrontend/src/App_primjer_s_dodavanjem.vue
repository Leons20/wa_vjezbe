<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Task from "./components/Task.vue";

onMounted(async ()=> {
  let response =  await axios.get("http:localhost:8000/tasks");
  console.log(response);
})

const tasks = ref([]);
const editing = ref(false);

function dodajZadatak(task) {
  tasks.value.unshift(task);
  editing.value = false;
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <!-- Header -->
    <header
      class="flex justify-between items-center bg-white p-4 shadow rounded-md mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Task Manager</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        @click="editing = true">
        Dodaj zadatak
      </button>
    </header>
    <!-- Task Input Component -->
    <Task v-if="editing" @saveTask="dodajZadatak" @cancel="editing = false" />

    <!-- Task List -->
    <div class="bg-white p-4 shadow rounded-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Vaši zadaci</h2>
      <ul class="space-y-4">
        <li
          v-for="(task, index) in tasks"
          :key="index"
          class="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow">
          <div>
            <p class="text-lg font-medium text-gray-800">{{ task.naslov }}</p>
            <p class="text-sm text-gray-600">{{ task.opis }}</p>
          </div>
          <div class="flex space-x-2">
            <button
              class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
              Dovršeno
            </button>
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              @click="tasks.splice(index, 1)">
              Obriši
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>