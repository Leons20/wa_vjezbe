<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Pizza Ponuda</h1>
    <div class="row g-4">
      <div v-for="pizza in pizze" :key="pizza._id" class="col-md-4">
        <div class="card h-100">
          <img :src="pizza.slika" class="card-img-top" alt="Slika pizze" />
          <div class="card-body">
            <h5 class="card-title">{{ pizza.naziv }}</h5>
            <p class="card-text">
              <strong>Cijena:</strong> {{ pizza.cijena }} €
            </p>
            <p class="card-text">
              <strong>Sastojci:</strong> {{ pizza.sastojci.join(', ') }}
            </p>
            <div>
              <label for="quantity" class="form-label">Količina</label>
              <input
                type="number"
                v-model.number="narudzba.pizza_stavke[index].kolicina"
                class="form-control"
                placeholder="Unesite količinu"
                :min="0"
              />
              <label for="size" class="form-label">Veličina</label>
              <select
                v-model="narudzba.pizza_stavke[index].velicina"
                class="form-select"
              >
                <option value="mala">Mala</option>
                <option value="srednja">Srednja</option>
                <option value="velika">Velika</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h3>Podaci za narudžbu</h3>
      <form @submit.prevent="posaljiNarudzbu">
        <div class="mb-3">
          <label for="ime" class="form-label">Ime</label>
          <input
            type="text"
            v-model="narudzba.ime"
            class="form-control"
            placeholder="Unesite vaše ime"
            required
          />
        </div>
        <div class="mb-3">
          <label for="adresa" class="form-label">Adresa</label>
          <input
            type="text"
            v-model="narudzba.adresa"
            class="form-control"
            placeholder="Unesite vašu adresu"
            required
          />
        </div>
        <div class="mb-3">
          <label for="telefon" class="form-label">Telefon</label>
          <input
            type="text"
            v-model="narudzba.telefon"
            class="form-control"
            placeholder="Unesite vaš telefon"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">Naruči pizze</button>
      </form>
    </div>
    <div v-if="poruka" class="alert alert-info mt-3" role="alert">
      {{ poruka }}
    </div>
    <div v-if="greske.length" class="alert alert-danger mt-3" role="alert">
      <ul>
        <li v-for="greska in greske" :key="greska">{{ greska }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default{
    name: 'PizzaList',
    data(){
        return{
            pizze: [],
            narudzba: {
                ime: '',
                adresa: '',
                telefon: '',
                pizza_stavke: [],
            },
            poruka: '',
            greske: [],
        };
    },
    async created(){
        try{
            const response = await axios.get('http://localhost:3000/pizze');
            this.pizze = response.data;
            this.narudzba.pizza_stavke = this.pizze.map(pizza => ({
                naziv: pizza.naziv,
                kolicina: 0,
                velicina: 'mala',
            }));
        } catch(error){
            console.error('Greška prilikom dohvaćanja pizza:', error);
        }
    },
    methods: {
        async posaljiNarudzbu(){
            this.greske = [];
            this.poruka = '';
            const stavkeZaSlanje = this.narudzba.pizza_stavke.filter(
                stavka => stavka.kolicina > 0
            );
            if(stavkeZaSlanje.length === 0){
                this.greske.push('Morate odabrati barem jednu pizzu.');
                return;
            }
            const podaciZaSlanje = {
                ...this.narudzba,
                pizza_stavke: stavkeZaSlanje,
            };
            try{
                const response = await axios.post('http://localhost:3000/narudzba', podaciZaSlanje);
                this.poruka = 'Narudžba uspješno poslana!';
                console.log(response.data);
                // Forma se mora resetirati nakon uspješne narudžbe
                this.narudzba = {
                    ime: '',
                    adresa: '',
                    telefon: '',
                    pizza_stavke: this.pizze.map(pizza => ({
                        naziv: pizza.naziv,
                        kolicina: 0,
                        velicina: 'mala',
                    })),
                };
            } catch(error){
                if(error.response && error.response.data) this.greske.push(error.response.data);
                else this.greske.push('Došlo je do greške prilikom slanja narudžbe.');
            }
        },
    },
};
</script>

<style>
.card-img-top{
    height: 200px;
    object-fit: cover;
}
</style>