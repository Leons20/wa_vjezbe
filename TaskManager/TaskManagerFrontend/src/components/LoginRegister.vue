<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
  
const router = useRouter();
const prijavljen = ref(true);
const username = ref('');
const password = ref('');
  
const toggleMode = () => {
  prijavljen.value = !prijavljen.value;
};

const handleSubmit = async () => {
  try{
    let endpoint;
    if(prijavljen.value){
      endpoint = '/api/auth/login';
    } else{
      endpoint = '/api/auth/register';
    }
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.error || 'Došlo je do greške!');
    }
    if(prijavljen.value){
      localStorage.setItem('token', data.token);
      router.push('/tasks');
    } else{
        prijavljen.value = true;
        username.value = '';
        password.value = '';
        alert('Registracija uspješna! Molimo prijavite se.');
      }
    } catch(error){
      alert(error.message);
    }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-form">
      <h1 class="auth-title">
        <span v-if="prijavljen" class="auth-mode">Prijava</span>
        <span v-else class="auth-mode">Registracija</span>
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
          />
        </div>
        <button type="submit">
          <span v-if="prijavljen">Prijava</span>
          <span v-else>Registracija</span>
        </button>
      </form>
      <p @click="toggleMode" class="toggle-mode">
        <span v-if="prijavljen">Trebate račun? Registracija</span>
        <span v-else>Već imate račun? Prijava</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login {
  width: 300px;
  margin: 20px auto;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.success {
  color: green;
}
.error {
  color: red;
}
</style>