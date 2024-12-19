$(document).ready (()=> {

    // Mobile menu jquery function

    $(".hamburg").on("click", ()=>{
        if($(".hamburg i").hasClass("fa-bars")) {
            $(".menu-page").toggleClass("menu-active")
            $(".hamburg i").addClass("fa-xmark").removeClass("fa-bars")
        

        } else if ($(".hamburg i").hasClass("fa-xmark")) {
            $(".menu-page").toggleClass("menu-active")
            $(".hamburg i").addClass("fa-bars").removeClass("fa-xmark")

        }
    })

    // Обработка отправки формы
    $(document).ready(function() {
        // Функция валидации номера телефона для Казахстана
        function validatePhone(phone) {
            // Обновленное регулярное выражение для казахстанских номеров
            // Принимает формат: +77XXXXXXXXX (всего 12 символов с +)
            const phoneRegex = /^\+77\d{9}$/;
            return phoneRegex.test(phone);
        }

        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            
            var form = $(this);
            var submitButton = form.find('button[type="submit"]');
            var phoneInput = form.find('#phone');
            var phoneValue = phoneInput.val();

            // Проверяем номер телефона
            if (phoneValue && !validatePhone(phoneValue)) {
                alert('Пожалуйста, введите корректный казахстанский номер телефона в формате: +77XXXXXXXXX');
                phoneInput.focus();
                return;
            }
            
            // Блокируем кнопку на время отправки
            submitButton.prop('disabled', true);
            
            $.ajax({
                type: 'POST',
                url: 'form.php',
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        alert(response.message);
                        form[0].reset(); // Очищаем форму
                    } else {
                        alert(response.message);
                    }
                },
                error: function() {
                    alert('Произошла ошибка при отправке формы');
                },
                complete: function() {
                    // Разблокируем кнопку после завершения запроса
                    submitButton.prop('disabled', false);
                }
            });
        });
    });

}) 