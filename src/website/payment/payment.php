<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '/var/www/html/tv/php-error.log');
# HighRiskShop Payment Gateway Base URL
$baseUrl = "https://pay.highriskshop.com/process-payment.php";
# Your Wallet Address
$address = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
# Payment Provider
$provider = "moonpay";
# Payment Currency
$currency = "USD";
# Site Language
$language = 'en';
# Plans
$plans_obj = [
    '29' => 'Basic',
    '39' => 'Gold',
    '49' => 'Premium',
    '59' => 'Elit',
];


function getPaymentUrl($address, $amount, $provider, $currency, $email)
{
    $url = 'https://pay.highriskshop.com/process-payment.php?address=' . $address
        . '&amount=' . urlencode($amount)
        . '&provider=' . urlencode($provider)
        . '&email=' . urlencode($email)
        . '&currency=' . urlencode($currency);
    return $url;
}

function getHostUrl()
{
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'];
    return $protocol . $host;
}

function getCallBackUrl($selected_plan, $email, $language)
{
    return getHostUrl() . "/payment/process.php?selected_plan=" . $selected_plan
        . "&email=" . $email
        . "&referenceSite=" . getHostUrl()
        . "&language=" . $language;
}

function redirect($url, $message = "")
{
    if ($message)
        echo "<script>alert('$message');</script>";
    else
        header("Location: $url");
    exit();
}

function createWallet($address, $callback)
{

    $url = "https://api.highriskshop.com/control/wallet.php?address=" . urlencode($address) . "&callback=" . urlencode($callback);
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Content-Type: application/json\r\n",
            'ignore_errors' => true
        ]
    ]);

    $response = file_get_contents($url, false, $context);
    if ($response === false) {
        echo "Error: Unable to connect to API.";
        redirect(getHostUrl(), "Error: Unable to connect to API.");
        exit();
    }

    $res = json_decode($response, true);
    if (!isset($res['address_in']))
        redirect(getHostUrl(), "Error: Unable to create wallet.");
    return $res['address_in'];
}


if ($_SERVER['REQUEST_METHOD'] != 'POST')
    redirect(getHostUrl(), "Error: Invalid request method.");



if (!isset($_POST['email']) || !isset($_POST['amount']))
    redirect(getHostUrl(), "Error: Invalid request parameters.");


$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$amount = filter_var($_POST['amount'], FILTER_VALIDATE_FLOAT);

$selected_plan = $plans_obj[strval($amount)];
if (!$selected_plan)
    redirect(getHostUrl(), "Error: Invalid plan amount. " . strval($amount));

$address = createWallet($address, getCallBackUrl($selected_plan, $email, $language));

if (!$email || !$amount)
    redirect(getHostUrl(), "Error: request parameters validation failed.");

redirect(getPaymentUrl($address, $amount, $provider, $currency, $email));
