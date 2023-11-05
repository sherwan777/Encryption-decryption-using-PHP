<?php
require_once 'vendor/paragonie/sodium_compat/autoload.php';
session_start();

if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'generateKeys':
            generateKeys();
            break;
        case 'encrypt':
            encrypt($_POST['publicKey'], $_POST['plainText']);
            break;
        case 'decrypt':
            decrypt($_POST['privateKey'], $_POST['cipherText']);
            break;
    }
}

function generateKeys() {
    $keypair = sodium_crypto_box_keypair();
    $publicKey = sodium_crypto_box_publickey($keypair);
    $privateKey = sodium_crypto_box_secretkey($keypair);
    $_SESSION['publicKey'] = $publicKey;

    // Encoding the keys in base64 before sending and separating them with a '|'
    echo base64_encode($publicKey) . '|' . base64_encode($privateKey);
}

function encrypt($publicKeyEncoded, $plainText) {
    try {
        $publicKey = base64_decode($publicKeyEncoded);
        $encrypted = sodium_crypto_box_seal($plainText, $publicKey);

        // Encoding the encrypted data in base64 before sending
        echo base64_encode($encrypted);
    } catch (SodiumException $e) {
        echo 'Error: ' . $e->getMessage();
    }
}


function decrypt($privateKeyEncoded, $cipherTextEncoded) {
    try {
        // Decoding the privateKey and cipherText from base64
        $publicKey = $_SESSION['publicKey'];
        $privateKey = base64_decode($privateKeyEncoded);
        $cipherText = base64_decode($cipherTextEncoded);

        $keypair = $privateKey . $publicKey;
        $decrypted = sodium_crypto_box_seal_open($cipherText, $keypair);

        if ($decrypted === false) {
            throw new Exception("Decryption failed.");
        }

        echo $decrypted;

    } catch (Exception $e) {
        // Outputting the error message for debugging purposes
        echo json_encode(['error' => $e->getMessage()]);
    }
}


?>
