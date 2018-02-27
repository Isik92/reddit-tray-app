'use strict';

const { ipcRenderer, shell } = require('electron')
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const snoowrap = require('snoowrap');

const a1 = new snoowrap({
  userAgent: 'Test App',
  clientId: '03Cpdo9YCmkKIw',
  clientSecret: '2VTCIOUrL2UbxtMisbGbAq32xS8',
  username: 'nero-92',
  password: 'Eded#2410'
});

document.addEventListener('DOMContentLoaded', () => {

  let promise1 = a1.getInbox()[0].body;



  promise1.then(returnValue => console.log(returnValue));

  document.querySelector('.list-group').innerHTML += `
  <li class="list-group-item">
    <div class="media-body">
      <span>${a1.getInbox()[0].body} replied to your post in ${a1.getInbox()[0].body}</span>
      <p>${promise1}</p>
      <span><a href="${a1.getInbox()[0].author}"> Post Reply </a>&nbsp;• ${a1.getInbox()[0].created} ago</span>
    </div>
  </li>
  `;

})

document.addEventListener('click', (event) => {

  if (event.target.href) {
    // Open links in external browser
    shell.openExternal(event.target.href)
    event.preventDefault()
  } else if (event.target.classList.contains('js-refresh-action')) {
    updateNotifications()
  } else if (event.target.classList.contains('js-quit-action')) {
    window.close()
  }

})

const updateView = (notifications) => {
  myConsole.log(notifications);
}

const updateNotifications = () => {

}

// Refresh notifications
const tenMinutes = 10 * 60 * 1000
setInterval(updateNotifications, tenMinutes);

