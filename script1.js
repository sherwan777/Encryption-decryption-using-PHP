document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("generate")
    .addEventListener("click", generateKeys);
  document.getElementById("encrypt").addEventListener("click", encrypt);
  document.getElementById("decrypt").addEventListener("click", decrypt);
});

function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }
  return response.text();
}

function generateKeys() {
  fetchData("action=generateKeys")
    .then((data) => {
      let [publicKey, privateKey] = data.split("|");
      document.getElementById("publicKey").value = publicKey.trim() || "";
      document.getElementById("privateKey").value = privateKey.trim() || "";
    })
    .catch((error) => {
      console.error(`Error during generateKeys: ${error}`);
    });
}

function encrypt() {
  const publicKey = encodeURIComponent(
    document.getElementById("publicKeyEncrypt").value || ""
  );
  const plainText = encodeURIComponent(
    document.getElementById("plainTextEncrypt").value || ""
  );

  fetchData(`action=encrypt&publicKey=${publicKey}&plainText=${plainText}`)
    .then((data) => {
      document.getElementById("cipherText").value = data || "";
    })
    .catch((error) => {
      console.error(`Error during encryption: ${error}`);
    });
}

function decrypt() {
  const privateKey = encodeURIComponent(
    document.getElementById("privateKeyDecrypt").value || ""
  );
  const cipherText = encodeURIComponent(
    document.getElementById("cipherTextDecrypt").value || ""
  );

  fetchData(`action=decrypt&privateKey=${privateKey}&cipherText=${cipherText}`)
    .then((data) => {
      // Parse the JSON response
      const jsonData = JSON.parse(data);

      // If there's an error, display the error message; otherwise, display the plaintext
      if (jsonData.error) {
        document.getElementById("plainTextDecrypt").value = jsonData.error;
      } else {
        document.getElementById("plainTextDecrypt").value =
          jsonData.plainText || "";
      }
    })
    .catch((error) => {
      console.error(`Error during decryption: ${error}`);
    });
}

function fetchData(bodyContent) {
  return fetch("ecc.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyContent,
  }).then(handleResponse);
}
