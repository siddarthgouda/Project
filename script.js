document.getElementById("upload-btn").addEventListener("click", async () => {
    const files = document.getElementById("file-input").files;
    if (files.length === 0) return;
  
    const table = document.querySelector("#file-table tbody");
  
    for (let file of files) {
      const reader = new FileReader();
  
      reader.onload = async function (e) {
        const arrayBuffer = e.target.result;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  
        // Generate AES key
        const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256("your-secret-key").toString());
        const encrypted = CryptoJS.AES.encrypt(wordArray, key, { mode: CryptoJS.mode.ECB }).toString();
        const hash = CryptoJS.SHA256(encrypted).toString();
  
        // Generate fake IPFS CIDs
        const ipfsCIDs = generateFakeCIDs(11);
  
        const row = table.insertRow();
        row.insertCell(0).textContent = file.name;
        row.insertCell(1).textContent = file.type;
        row.insertCell(2).textContent = (file.size / 1024).toFixed(2);
        row.insertCell(3).textContent = new Date().toLocaleString();
        row.insertCell(4).textContent = hash;
  
        // Download buttons
        const downloadCell = row.insertCell(5);
        const downloadEncryptedBtn = document.createElement("button");
        downloadEncryptedBtn.textContent = "Encrypted File";
        downloadEncryptedBtn.onclick = () => {
          const blob = new Blob([encrypted], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Encrypted_" + file.name + ".txt";
          a.click();
        };
  
        const downloadDecryptedBtn = document.createElement("button");
        downloadDecryptedBtn.textContent = "Decrypted File";
        downloadDecryptedBtn.onclick = () => {
          const decrypted = CryptoJS.AES.decrypt(encrypted, key, { mode: CryptoJS.mode.ECB });
          const decryptedData = decrypted.toString(CryptoJS.enc.Latin1);
          const blob = new Blob([decryptedData], { type: file.type });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Decrypted_" + file.name;
          a.click();
        };
  
        downloadCell.appendChild(downloadEncryptedBtn);
        downloadCell.appendChild(downloadDecryptedBtn);
  
        // IPFS CID list
        const cidCell = row.insertCell(6);
        const ul = document.createElement("ul");
        ipfsCIDs.forEach(cid => {
          const li = document.createElement("li");
          li.textContent = cid;
          ul.appendChild(li);
        });
        cidCell.appendChild(ul);
      };
  
      reader.readAsArrayBuffer(file);
    }
  });
  
  // Generate Fake IPFS CIDs
  function generateFakeCIDs(count = 11) {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    const cids = [];
  
    for (let i = 0; i < count; i++) {
      let cid = "Qm";
      for (let j = 0; j < 44; j++) {
        cid += charset[Math.floor(Math.random() * charset.length)];
      }
      cids.push(cid);
    }
  
    return cids;
  }
  