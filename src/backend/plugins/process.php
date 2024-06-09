<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../vendor/autoload.php';
require_once '../secrets.php';

\Stripe\Stripe::setApiKey($stripeSecretKey);

// Retrieve parameters from the URL
if (!isset($_GET['session_id']) || !isset($_GET['selected_plan'])) {
    echo "Error: session_id is required.";
    exit;
}

$sessionId = $_GET['session_id'];
$selectedPlan = $_GET['selected_plan'];

try {
    // Get the Checkout Session data
    $checkout_session = \Stripe\Checkout\Session::retrieve($sessionId);

    // Access the customer's email from the Checkout Session data
    $customerEmail = $checkout_session->customer_details->email;

} catch (\Stripe\Exception\ApiErrorException $e) {
    echo "Error retrieving Checkout Session data: " . $e->getMessage();
    exit;
}


// CHANGE THIS VALUES TO THE SITES VALUES
$apiUrl = 'https://api.ipshort.com/api/v1/product/sell';
$apiToken = 'A1f3cCbd988Pdf7180a510b-51e462ae5654837c87f00392b9d2b72d-35ea6a5';
$referenceSite = 'https://tv-luxury.com/';
$language = 'fr';
// END OF CHANGE

$data = [
    'api_token' => $apiToken,
    'email' => $customerEmail,
    'selected_plan' => $selectedPlan,
    'referenceSite' => $referenceSite,
    'language' => $language,
    'StripPaymentId' => $sessionId
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ],
];

$context  = stream_context_create($options);
$result = file_get_contents($apiUrl, false, $context);

if ($result === false) {
    echo "API request failed.";
    echo '<pre>Response Body: ';
    print_r($result);
    echo '</pre>';
 
}else {
    header("HTTP/1.1 303 See Other");
    header("Location: ".$referenceSite . "thank_you.html");
}
exit;
?>