
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    {path: 'user/:token', component: User}
  ]
})

var app = new Vue({
  el: '#app',
  data: {
    message: "Sup",
    user: {name: "", username: "", email: "", password: ""},
    is_login: false,
    jwt_token: ""
  },
  methods: {

  },
  created: () => {
    // console.log("this.$route.query.token", this.$route.query.token);
    console.log("this.$route", this.$route);
    console.log("this.$http", this.$http);
    console.log("this.router", this.router);

    var urlParams = new URLSearchParams(window.location.search);

    console.log("urlParams.get('token')",urlParams.get('token'))

    this.jwt_token = urlParams.get('token');
    console.log("this.jwt_token",this.jwt_token)

  }
}) // end of var app
