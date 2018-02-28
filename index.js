'use strict';

const { ipcRenderer, shell } = require('electron');
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var moment = require('moment');

var date = require('date');

var currentDate = new Date();

const snoowrap = require('snoowrap');

const a1 = new snoowrap({
  userAgent: 'Test App',
  clientId: '03Cpdo9YCmkKIw',
  clientSecret: '2VTCIOUrL2UbxtMisbGbAq32xS8',
  username: 'nero-92',
  password: 'Eded#2410'
});

document.addEventListener('DOMContentLoaded', () => {


  function loadMessages() {


  a1.getInbox().then(inboxArray => {

    currentDate = new Date();

    inboxArray.forEach(function (element) {

      Promise.all([element.author.name, element.subreddit ? element.subreddit.display_name : "No display name", element.body, element.created_utc]).then(returnValue => 
        
        document.querySelector('.list-group').innerHTML += `
          <li class="list-group-item">
            <div class="media-body">
              <span><a href="https://www.reddit.com/user/${element.author.name}">u/${element.author.name}</a> replied to your post in ${element.subreddit ? element.subreddit.display_name : "Private Messages"}</span>
              <p>${element.body}</p>
              <span>${moment.unix(element.created_utc).fromNow()}</span>
            </div>
          </li>
          `)
    })
  }

)

document.querySelector('.footer-content').innerHTML = `Updated ${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()}, 
${currentDate.getHours()}:${currentDate.getMinutes().toFixed()}`;
};

loadMessages();

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

  });

  const updateNotifications = () => {
    document.querySelector('.list-group').innerHTML = ``;
    loadMessages();
  }

  // Refresh notifications
  const tenMinutes = 10 * 60 * 1000
  setInterval(updateNotifications, tenMinutes);
});