

var app = new Vue({
  el: '#app',
  data: {
    message: "Sup",
    user_form: {name: "", username: "", email: "", password: ""},
    task_form: {name: "", is_completed: ""},
    user: {},
    is_login: false
  },
  methods: {
    onSubmitForm: (e) => {
      e.preventDefault();
      // alert(app.user.username)

      axios.post('http://localhost:3000/users/signin', {
        username: app.user_form.username,
        password: app.user_form.password
      })
      .then(function (response) {
        // get the token, save in local storage
        console.log(response);
        localStorage.setItem('token', response.data);
        console.log(localStorage.token);

        window.location.href = "todo.html"

      })
      .catch(function (error) {
        console.log(error);
      });


    }, // end of onSubmitForm
    addTask: (e) => {
      e.preventDefault();
      console.log("app.task_form.name", app.task_form.name)

      // need to validate if


      axios.post('http://localhost:3000/todos/addtask', {
        name: app.task_form.name
      }, {
        headers: { token: localStorage.token }
      })
      .then(function (response) {
        // get the token, save in local storage
        console.log(response);

        // reload page
        // window.location.href = "todo.html"

        // add to tasks
        app.user.todo.tasks.push(response.data);

      })
      .catch(function (error) {
        console.log(error);
      });

      // alert('hey')
    }, // end of addTask
    markComplete: (task_id) => {
      console.log(task_id)

      axios.put('http://localhost:3000/tasks/toggle/' + task_id )
      .then(function (response) {
        // get the token, save in local storage
        console.log(response);

        // reload page
        // window.location.href = "todo.html"

        // toogle is_completed field
        // app.user.todo.tasks.push(response.data);
        app.user.todo.tasks.map( t => {
          if(t._id == task_id){
            if(t.is_completed) t.is_completed = false;
            else t.is_completed = true;
          }
        })

      })
      .catch(function (error) {
        console.log(error);
      });
    }, // end of markComplete
    deleteTask: (task_id) => {
      console.log(task_id);
      axios.delete('http://localhost:3000/tasks/' + task_id )
      .then(function (response) {
        // get the token, save in local storage
        console.log(response);

        // reload page
        // window.location.href = "todo.html"

        // delete task
        // app.user.todo.tasks.push(response.data);

        var elementPos = app.user.todo.tasks.map(function(x) {return x._id; }).indexOf(task_id);
        console.log('elementPos', elementPos);
        app.user.todo.tasks.splice(elementPos, 1);
      })
      .catch(function (error) {
        console.log(error);
      });



    }, // end of deleteTask
    signOut: () => {
      localStorage.removeItem('token');

      this.is_login = false;
      window.location.href = 'index.html'
    } // end of signOut
  },
  created: () => {

    axios.get(
      'http://localhost:3000/users/todo',
      {
        headers: { token: localStorage.token }
      }
    )
    .then (response => {
      console.log(response);
      // app.items.push(response.data[0])
      // need to call app.items instead of this.items

      app.user = response.data;
      console.log(app.user);

      if(localStorage.token != null){
        app.is_login = true;
      }

      if(response.data.message == "jwt expired")
        app.message = "Token is expired, please sign in again."

    })
    .catch (err => {
      console.log(err);
    })

  } // end of created
}) // end of var app
