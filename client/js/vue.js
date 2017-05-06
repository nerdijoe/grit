var app = new Vue({
  el: '#app',
  data: {
    message: "Sup",
    user: {name: "", username: "", email: "", password: ""},
    is_login: false
  },
  methods: {
    onSubmitForm: (e) => {
      e.preventDefault();
      // alert(app.user.username)

      axios.post('http://localhost:3000/users/signin', {
        username: app.user.username,
        password: app.user.password
      })
      .then(function (response) {
        // get the token, save in local storage
        console.log(response);
        localStorage.setItem('token', response.data);
        console.log(localStorage.token);

        window.location.href = "index.html"

      })
      .catch(function (error) {
        console.log(error);
      });


    }// end of onSubmitForm
  },
  created: () => {

  }
}) // end of var app
