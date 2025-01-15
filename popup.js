function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
      notification.classList.remove('show', 'error', 'success');
    notification.classList.add('show', type);
  
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  document.getElementById('get-token-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes("discord.com")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const token = JSON.parse(localStorage.getItem('token'));
          return token;
        },
      }, (result) => {
        if (result && result[0].result) {
          document.getElementById('token').value = result[0].result;
          showNotification("Token Retrieved Successfully!", "success");
          document.getElementById('copy-btn').disabled = false;
        } else {
          document.getElementById('token').value = 'Token not found';
          showNotification("Failed To Retrieve Token!", "error");
        }
      });
    } else {
      document.getElementById('token').value = "This Script Only Works On discord.com";
      showNotification("This Script Only Works On discord.com", "error");
    }
  });
  
  document.getElementById('copy-btn').addEventListener('click', () => {
    const token = document.getElementById('token').value;
    if (token && token !== 'Token not found' && token !== 'This script only works on discord.com.') {
      navigator.clipboard.writeText(token).then(() => {
        showNotification("Token Copied To Clipboard!", "success");
      }).catch(err => {
        showNotification("Failed To Copy Token!", "error");
        console.error("Error copying token : ", err);
      });
    } else {
      showNotification("No Token To Copy!", "error");
    }
  });
  
  document.getElementById('login-btn').addEventListener('click', async () => {
    const token = document.getElementById('login-token').value;
    if (token) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url.includes("discord.com")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (token) => {
            localStorage.setItem('token', JSON.stringify(token));
            location.reload();
          },
          args: [token],
        }, () => {
          showNotification("Logged In With Token!", "success");
        });
      } else {
        showNotification("This Script Only Works On discord.com", "error");
      }
    } else {
      showNotification("Please Enter A Token!", "error");
    }
  });
  
  document.getElementById('get-token-tab').addEventListener('click', () => {
    document.getElementById('get-token-content').classList.add('active');
    document.getElementById('login-content').classList.remove('active');
    document.getElementById('get-token-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
  });
  
  document.getElementById('login-tab').addEventListener('click', () => {
    document.getElementById('login-content').classList.add('active');
    document.getElementById('get-token-content').classList.remove('active');
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('get-token-tab').classList.remove('active');
  });