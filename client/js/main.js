$(document).ready(function() {

  $('#btnLogin').click(function() {
      $('#modalLogin').modal('show')
      // alert('modallogin');
  })
  $('#btnSubmitLogin').click(function() {
      $('#modalLogin').modal('hide')
  })

  $('#btnSignUp').click(function() {
      $('#modalSignUp').modal('show')
  })
  $('#btnSubmitSignUp').click(function() {
      $('#modalSignUp').modal('hide')
  })

  $('#btnSignUpBig').click(function() {
      $('#modalSignUp').modal('show')
  })



});
