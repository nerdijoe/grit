$(document).ready(function() {

  $('form')
    .form({
      on: 'blur',
      fields: {
        name: {
          identifier  : 'name',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a value'
            }
          ]
        }
      }
    })
  ;


});
