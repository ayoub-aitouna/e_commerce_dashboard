<?php

// API request to http://localhost:8080/api/v1/product/sell
$apiUrl = 'https://api.ipshort.com/api/v1/product/sell';
$apiToken = 'A1f3cCbd988Pdf7180a510b-51e462ae5654837c87f00392b9d2b72d-35ea6a5';


// Retrieve parameters from the URL
if (!isset($_GET['selected_plan']) || !isset($_GET['email']) || !isset($_GET['referenceSite']) || !isset($_GET['language'])) {
    echo "Error: [selected_plan, email, referenceSite, language] parameters are required.";
    exit;
}

$selectedPlan = filter_var($_GET['selected_plan'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$customerEmail = filter_var($_GET['email'],  FILTER_VALIDATE_EMAIL);
$referenceSite = filter_var($_GET['referenceSite'], FILTER_SANITIZE_URL);
$language = filter_var($_GET['language'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

$data = [
    'api_token' => $apiToken,
    'email' => $customerEmail,
    'selected_plan' => $selectedPlan,
    'referenceSite' => $referenceSite,
    'language' => $language,
    'StripPaymentId' => strval(uniqid()),
];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ],
];

print_r(json_encode($data));
echo '<br>';
$context  = stream_context_create($options);
$result = @file_get_contents($apiUrl, false, $context);

if ($result === false) {
    echo "Failed to make the API request.\n";
    exit();
}

$statusCode = null;
if (isset($http_response_header) && preg_match('/\bHTTP\/\S+\s+(\d{3})\b/', $http_response_header[0], $matches)) {
    $statusCode = $matches[1];
}
if ($statusCode != 200) {
    echo "API request failed. Status Code: " . ($statusCode ?: 'Unknown') . "\n";
    echo '<pre>Response Headers: ';
    print_r($http_response_header);
    echo '<pre>Response Body: ';
    print_r($result);
    echo '</pre>';
    exit();
}
print_r("Location: " . $referenceSite . "/thank_you.html");
header("HTTP/1.1 303 See Other");
header("Location: " . $referenceSite . "/thank_you.html");
exit();
