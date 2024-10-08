<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

    if ($email) {
        // Email is valid, forward to payment gateway
        // Example: Redirect to payment page or API call to payment gateway
        header("Location: https://pay.highriskshop.com/process-payment.php?address=k1PrTuxSNpkdPZwdmCm4K3nMjAYo1sx17ea6uG0LunhFbr7SHBGQ8NBs3b5jkQw9RVoyWIbOyqzh7wtEipPbGg%3D%3D&amount=103.78&provider=moonpay&currency=USD&email=" . urlencode($email));
        exit();
    } else {
        echo "Invalid email address. Please go back and try again.";
    }
}else{
    header("Location: http://localhost:5500/index.php");
    exit();
}
?>
