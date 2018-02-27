'use strict';

const { ipcRenderer, shell } = require('electron')
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var moment = require('moment');
moment().format();

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

  let messageAuthor = a1.getInbox()[1].author.name;
  let messageSubreddit = a1.getInbox()[1].subreddit.display_name;
  let messageBody = a1.getInbox()[1].body;
  let messageTimeAgo = a1.getInbox()[1].created;


  Promise.all([messageAuthor, messageSubreddit, messageBody,messageTimeAgo]).then(
    returnValue => document.querySelector('.list-group').innerHTML += `
  <li class="list-group-item">
    <div class="media-body">
      <span>${returnValue[0]} replied to your post in ${returnValue[1]}</span>
      <p>${returnValue[2]}</p>
      <span>${moment(returnValue[3]).from(currentDate.getDate())}</span>
    </div>
  </li>
  `)

});

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

