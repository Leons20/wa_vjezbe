<template>
  <div class="bg-white p-4 shadow rounded-md mb-6">
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="naslov">
        Naslov zadatka:
      </label>
      <input
        id="naslov"
        type="text"
        v-model="naslovZadatka"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Unesite naslov zadatka" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="opis">
        Opis zadatka:
      </label>
      <textarea
        id="opis"
        v-model="opisZadatka"
        rows="3"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Unesite opis zadatka"></textarea>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="tagovi">
        Tagovi (odvojite ih zarezom):
      </label>
      <input
        id="tagovi"
        type="text"
        v-model="tagoviZadatka"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Unesite tagove, npr. 'hitno, faks, pomalo'" />
    </div>

    <div v-if="prikazTagova.length" class="mb-4 flex flex-wrap gap-2">
      <TaskTag
        v-for="(tagObj, index) in prikazTagova"
        :key="index"
        :tag="tagObj.tag"
        :className="tagObj.colorClass" 
      />
    </div>
    <div class="flex space-x-4">
      <button
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        @click="spremiZadatak">
        Spremi zadatak
      </button>
      <button
        class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        @click="emit('cancel')">
        Odustani
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import TaskTag from "./TaskTag.vue";

defineProps({
    id: String,
    naslov: String,
    opis: String,
    zavrsen: Boolean,
    tags: Array,
});

const emit = defineEmits(["saveTask", "cancel"]);

const naslovZadatka = ref("");
const opisZadatka = ref("");
const tagoviZadatka = ref("");

const prikazTagova = computed(() => {
  return tagoviZadatka.value
    .split(",") 
    .map((tag) => tag.trim()) 
    .filter((tag) => tag) 
    .map((tag) => {
      return {
        tag: tag, 
        colorClass: getTagColor(tag), 
      };
    });
});

function getTagColor(tag){
  switch(tag.toLowerCase()){
    case "hitno":
      return "bg-red-500 text-white";
    case "faks":
      return "bg-blue-500 text-white";
    case "pomalo":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-300 text-gray-800"; 
  }
}

async function spremiZadatak(){
  if(naslovZadatka.value.trim() && opisZadatka.value.trim()){
    const tagovi = prikazTagova.value; 
  
    const noviZadatak = {
      naslov: naslovZadatka.value,
      opis: opisZadatka.value,
      tags: tagovi, 
    };
  
    try{
      const response = await axios.post("http://localhost:8000/tasks", noviZadatak);
  
      console.log("Zadatak uspješno spremljen:", response.data);
  
      emit("saveTask", noviZadatak);
  
      naslovZadatka.value = "";
      opisZadatka.value = "";
      tagoviZadatka.value = "";
    } catch(error){
      console.error("Greška prilikom spremanja zadatka:", error.response?.data || error.message);
    }
  } else{
    console.warn("Naslov i opis su obavezni!");
  }
}
</script>

<style scoped></style>