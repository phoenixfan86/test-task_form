$(document).ready(function() {
  let answers = JSON.parse(localStorage.getItem('userAnswers')) || {};

  $('.answers-button').on('click', function() {
    const questionId = $(this).closest('.question').attr('id');
    const answerText = $(this).text().trim();

    answers[questionId] = answerText;
    localStorage.setItem('userAnswers', JSON.stringify(answers));
  });

  // виводимо відповіді в консоль і очишчаємо localStorage
  $('#toCart').on('click', function() {
    console.log('Всі відповіді:', answers);
    localStorage.removeItem('userAnswers');
  });

  const $email = $('#email');
  const $hints = $('.email-hint');

$(document).on('click', function(e){
if (!$(e.target).closest($email, $hints).lenght){
  $hints.css({
    'visibility':'hidden',
    'opacity': 0
  }).hide();
}
})

  // підказки з доменами
  $email.on('input', function () {
    const val = $(this).val();
    if (val && !val.includes('@')) {
      $hints.css({
        'visibility':'visible',
        'opacity': 1
      }).show();
    } else {
      $hints.css({
        'visibility':'hidden',
        'opacity': 0
      }).hide();
    }
  });

  // натискання на підказку домену
  $hints.on('click', '.email', function () {
    const domain = $(this).data('value');
    let val = $email.val().trim();
    val=val.replace(/@.*/,'');
    $email.val(val + '@' + domain);
    $hints.css({
        'visibility':'hidden',
        'opacity': 0
      }).hide();

    
  });

  // Валідація при натисканні на кнопку continue
  $('#TO_DELIVERY').on('click', function (e) {
    e.preventDefault();

    const firstname = $('#firstname').val().trim();
    const lastname = $('#lastname').val().trim();
    const phone = $('#phone').val().trim();
    const email = $('#email').val().trim();
    const country = $('#country').val().trim();
    const city = $('#city').val().trim();
    const zipcode = $('#zipcode').val().trim();
    const address = $('#address').val().trim();

    let valid = true;

    //умови для полів
    if (!/^[A-Za-z\- ]{2,}$/.test(firstname)) {
      $('#firstnameInvalid').show();
      valid = false;
    } else {
      $('#firstnameInvalid').hide();
    }

    if (!/^[A-Za-z\- ]{2,}$/.test(lastname)) {
      $('#lastnameInvalid').show();
      valid = false;
    } else {
      $('#lastnameInvalid').hide();
    }

    if (!/^[0-9]{11,11}$/.test(phone)) {
      $('#phoneInvalid').show();
      valid = false;
    } else {
      $('#phoneInvalid').hide();
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      $('#emailInvalid').show();
      valid = false;
    } else {
      $('#emailInvalid').hide();
    }

    if (!/^[A-Za-z\- ]{3,}$/.test(country)) {
      $('#firstnameInvalid').show();
      valid = false;
    } else {
      $('#firstnameInvalid').hide();
    }

    if (!/^[A-Za-z\- ]{3,}$/.test(city)) {
      $('#cityInvalid').show();
      valid = false;
    } else {
      $('#cityInvalid').hide();
    }

    if (!/^[A-Za-z0-9\- ]{6,}$/.test(zipcode)) {
      $('#zipcodeInvalid').show();
      valid = false;
    } else {
      $('#zipcodeInvalid').hide();
    }

    if (!/^[A-Za-z0-9\- ]{3,}$/.test(address)) {
      $('#addressInvalid').show();
      valid = false;
    } else {
      $('#addressInvalid').hide();
    }

    // виводим усе в консоль якщо все правильно
    if (valid) {
      const formData ={
        firstname,
        lastname,
        phone,
        email,
        city,
        zipcode,
        address,
      }
      localStorage.setItem('userData', JSON.stringify(formData))
      console.log('Дані користувача', formData);
    }
  });
});

