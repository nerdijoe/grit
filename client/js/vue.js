

var app = new Vue({
  el: '#app',
  data: {
    message: "Sup",
    message_signup: "",
    user_form: {name: "", username: "", email: "", password: ""},
    task_form: {name: "", is_completed: ""},
    user: { todo: { tasks : [] }},
    is_login: false,
    num_incomplete: 0,
    num_complete: 0
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
        console.log("**** Error signin")
        console.log(error);

        $('#modalSignInError').modal('show');
      });


    }, // end of onSubmitForm
    onSubmitSignUpForm: (e) => {
      e.preventDefault();
      // alert(app.user.username)

      axios.post('http://localhost:3000/users/signup', {
        name: app.user_form.name,
        username: app.user_form.username,
        email: app.user_form.email,
        password: app.user_form.password
      })
      .then(function (response) {
        if (response.data.hasOwnProperty('errors')) {
            console.log(response.data);
            // console.log(err);
            console.log("**** sign up error")
            $('#modalSignUpError').modal('show');
        } else {
            $('#modalSignUpSuccessful').modal('show');
            console.log(response);
        }
      })
      .catch(function (error) {
        console.log(error);
      });


    }, // end of onSubmitSignUpForm
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
        app.num_incomplete++;
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
            if(t.is_completed) {
              t.is_completed = false;
              app.num_complete--;
              app.num_incomplete++;
            }
            else {
              t.is_completed = true;
              app.num_complete++;
              app.num_incomplete--;

            }
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

        // update completed and incomplete
        if(app.user.todo.tasks.length > 0) {
          app.num_complete = 0;
          app.num_incomplete = 0;
          app.user.todo.tasks.map( t => {
            if(t.is_completed)
              app.num_complete++;
            else
              app.num_incomplete++;
          })
        }

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
  filters: {
    localTime: function (date) {
      //  return moment(date + ' Z', 'YYYY-MM-DD HH:mm:ss Z', true).format('D MMM YYYY HH:mm');
      // return moment().format("MMM Do");
      return moment(date).format('YYYY-MM-DD HH:m:s');

      // var dateFormat = require('dateformat');
      // var now = new Date(date);
      // return dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

      // var today = new Date(date);
      // return strftime('%m', today)

      // var formatdate = Date.parse(date);
      // console.log(formatdate.toString('dd-MMM-yyyy'));
      // return formatdate.toString('dd-MMM-yyyy');

      // return date;
    }
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
      else {
        console.log('token is null')
        // window.location.href = 'login.html'
      }

      if(response.data.message == "jwt expired") {
        app.message = "Token is expired, please sign in again."
        localStorage.removeItem('token');
        this.is_login = false;
        $('#modalTokenExpired').modal('show');
        window.location.href = 'index.html'
      }

      // calculate incomplete and completed tasks
      if(app.user.todo.tasks.length > 0) {
        app.user.todo.tasks.map( t => {
          if(t.is_completed)
            app.num_complete++;
          else
            app.num_incomplete++;
        })
      }

    })
    .catch (err => {
      console.log(err);
    })

  } // end of created
}) // end of var app
