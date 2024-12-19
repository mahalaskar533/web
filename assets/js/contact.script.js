$(document).ready(function() {
    // Изначально отключаем кнопку отправки
    $('#contact-submit').prop('disabled', true);

    // Функция валидации телефона
    function validatePhone(phone) {
        return /^\+77\d{9}$/.test(phone);
    }

    // Обработчик ввода телефона
    $('#tele').on('input', function() {
        let phoneValue = $(this).val();
        
        // Удаляем все нецифровые символы, кроме +
        phoneValue = phoneValue.replace(/[^\d+]/g, '');
        
        // Проверяем и добавляем +77 если нужно
        if (!phoneValue.startsWith('+')) {
            phoneValue = '+' + phoneValue;
        }
        if (!phoneValue.startsWith('+77') && phoneValue.startsWith('+')) {
            phoneValue = '+77' + phoneValue.slice(1);
        }
        
        // Обрезаем до нужной длины
        if (phoneValue.length > 12) {
            phoneValue = phoneValue.slice(0, 12);
        }
        
        // Обновляем значение поля
        $(this).val(phoneValue);
        
        // Проверяем валидность
        if (validatePhone(phoneValue)) {
            $(this).removeClass('is-invalid');
            $('#tele-feedback').hide();
            if ($('#confirm-detail').is(':checked')) {
                $('#contact-submit').prop('disabled', false);
            }
        } else {
            $(this).addClass('is-invalid');
            $('#tele-feedback').show();
            $('#contact-submit').prop('disabled', true);
        }
    });

    // Обработчик чекбокса
    $('#confirm-detail').on('change', function() {
        const phoneValid = validatePhone($('#tele').val());
        if ($(this).is(':checked') && phoneValid) {
            $('#contact-submit').prop('disabled', false);
        } else {
            $('#contact-submit').prop('disabled', true);
        }
    });

    // Обработчик отправки формы
    $('.contact-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: $('#firstname').val() + ' ' + $('#lastname').val(),
            email: $('#email').val(),
            phone: $('#tele').val(),
            message: $('#message').val()
        };

        $.ajax({
            type: 'POST',
            url: '/assets/pages/form.php',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#submit-success').show();
                    $('.contact-form')[0].reset();
                    $('#contact-submit').prop('disabled', true);
                } else {
                    alert('Ошибка: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.log('Error:', xhr.responseText);
                console.log('Status:', status);
                console.log('Error:', error);
                alert('Произошла ошибка при отправке формы');
            }
        });
    });
});