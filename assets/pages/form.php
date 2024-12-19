<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Устанавливаем заголовок для JSON-ответа
    header('Content-Type: application/json; charset=utf-8');

    // Параметры подключения к базе данных
    $db_host = "localhost";
    $db_user = "root"; // Ваш пользователь базы данных
    $db_pass = ""; // Ваш пароль базы данных
    $db_name = "bkz_db"; // Имя базы данных

    try {
        // Подключение к базе данных
        $conn = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Проверка, что все необходимые данные переданы
        if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['phone']) || empty($_POST['message'])) {
            echo json_encode(['success' => false, 'message' => 'Все поля обязательны для заполнения.']);
            exit;
        }

        // Получаем данные из формы
        $name = htmlspecialchars(trim($_POST['name']));
        $email = htmlspecialchars(trim($_POST['email']));
        $phone = htmlspecialchars(trim($_POST['phone']));
        $message = htmlspecialchars(trim($_POST['message']));

        // Проверка корректности email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Введите корректный email.']);
            exit;
        }

        // SQL-запрос для вставки данных
        $stmt = $conn->prepare("INSERT INTO messages (name, email, phone, message) VALUES (:name, :email, :phone, :message)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':message', $message);

        // Выполняем запрос
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Спасибо! Ваше сообщение отправлено.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении данных.']);
        }

    } catch (PDOException $e) {
        // Логирование ошибок и возврат сообщения об ошибке
        error_log("Ошибка PDO: " . $e->getMessage(), 3, "error_log.log");
        echo json_encode(['success' => false, 'message' => 'Ошибка базы данных. Подробности записаны в логи.']);
    }

    // Закрываем соединение
    $conn = null;
} else {
    // Если метод запроса не POST
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Неверный метод запроса.']);
}
?>
