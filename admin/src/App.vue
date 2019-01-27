<template>
  <div class="container is-fluid">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Generate Token</p>
      </header>
      <div class="card-content">
        <b-field label="Name">
          <b-input placeholder="Name"></b-input>
        </b-field>

        <b-field label="Expiry">
          <b-input placeholder="Expiry" type="number" v-model="expiry" min="1" max="168"></b-input>
        </b-field>

        <div class="container has-text-centered">
          <button class="button is-primary is-medium" @click="generate">Generate</button>
        </div>

        <b-field label="Token">
          <b-input placeholder="Name" v-model="generatedToken" readonly></b-input>
        </b-field>
      </div>
    </div>

    <div class="card">
      <header class="card-header">
        <p class="card-header-title">View Token</p>
      </header>
      <div class="card-content">
        <b-field label="Token">
          <b-input placeholder="Token"></b-input>
        </b-field>

        <div class="container has-text-centered">
          <button class="button is-primary is-medium">View</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  methods: {
    generate() {
      this.generatedToken = "DEMO";
    }
  },
  data() {
    return {
      expiry: 24,
      generatedToken: null
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
