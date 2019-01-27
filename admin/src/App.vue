<template>
  <div class="container is-fluid">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">Generate Token</p>
      </header>
      <div class="card-content">
        <b-field label="Name">
          <b-input placeholder="Name" v-model="name"></b-input>
        </b-field>

        <b-field label="Key">
          <b-input placeholder="Key" v-model="key"></b-input>
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
          <b-input placeholder="Token" v-model="token"></b-input>
        </b-field>

        <div class="container has-text-centered">
          <button class="button is-primary is-medium" @click="view">View</button>
        </div>

        <b-field label="Service">
          <b-input placeholder="Service" v-model="parsedService" readonly></b-input>
        </b-field>

        <b-field label="User">
          <b-input placeholder="User" v-model="parsedUser" readonly></b-input>
        </b-field>

        <b-field label="Issued at">
          <b-input placeholder="Issued at" v-model="parsedIssuedAt" readonly></b-input>
        </b-field>

        <b-field label="Expires in">
          <b-input placeholder="Expires in" v-model="parsedExpiresIn" readonly></b-input>
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  name: "app",
  components: {},
  methods: {
    generate() {
      this.loading = true;
      this.generatedToken = null;
      axios
        .post("/~auth/api/token", {
          user: this.name,
          key: this.key,
          expiry: this.expiry
        })
        .then(res => {
          this.loading = false;
          this.generatedToken = res.data.token;
        })
        .catch(err => {
          this.loading = false;
          this.$toast.open({
            duration: 5000,
            message: err.response.data.message,
            type: "is-danger"
          });
        });
    },
    view() {
      this.loading = true;
      this.parsedToken = null;
      axios
        .get(`/~auth/api/token/${this.token}`)
        .then(res => {
          this.loading = false;
          this.parsedService = res.data.kid;
          this.parsedUser = res.data.sub;
          this.parsedIssuedAt = moment(res.data.iat * 1000).format(
            "DD/MM/YYYY HH:mm:ss"
          );
          this.parsedExpiresIn = moment(res.data.exp * 1000).format(
            "DD/MM/YYYY HH:mm:ss"
          );
        })
        .catch(err => {
          this.loading = false;
          this.$toast.open({
            duration: 5000,
            message: err.response.data.message,
            type: "is-danger"
          });
        });
    }
  },
  data() {
    return {
      loading: false,
      name: null,
      key: null,
      expiry: 24,
      generatedToken: null,
      token: null,
      parsedToken: null,
      parsedService: null,
      parsedUser: null,
      parsedIssuedAt: null,
      parsedExpiresIn: null
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
