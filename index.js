'use strict';

const { ipcRenderer, shell } = require('electron');
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

var moment = require('moment');
var date = require('date');
var currentDate = new Date();
const snoowrap = require('snoowrap');
const Store = require('electron-store');
const store = new Store();

var notifications = '';
var newNotifications = '';
let userAccount;


if (
  store.get('useragent') &&
  store.get('clientid') &&
  store.get('clientsecret') &&
  store.get('username') &&
  store.get('password')) {

  userAccount = new snoowrap({
    userAgent: store.get('useragent'),
    clientId: store.get('clientid'),
    clientSecret: store.get('clientsecret'),
    username: store.get('username'),
    password: store.get('password')
  });
}

document.addEventListener('DOMContentLoaded', () => {


  document.querySelector('#login-overlay').style.display = 'none';

  function loadMessages() {

    if (userAccount) {

      userAccount.getInbox().then(inboxArray => {

        currentDate = new Date();

        inboxArray.forEach(function (element) {

          newNotifications += element.id;

          var messageAuthor;

          if (element.author) {
            messageAuthor = `<a href="https://www.reddit.com/user/${element.author.name}">u/${element.author.name}</a>`
          } else {
            messageAuthor = 'Subreddit Mod';
          }

          Promise.all([messageAuthor, element.subreddit ? element.subreddit.display_name : "No display name", element.body_html, element.created_utc]).then(returnValue => {

            var messageSource = element.subreddit ? element.subreddit.display_name : "PMs";
            var messageSourceLink;

            if (messageSource != 'PMs') {
              messageSource = `<a href="https://www.reddit.com/r/${messageSource}">/r/${messageSource}</a>`;
            }

            document.querySelector('.list-group').innerHTML += `
          <li class="list-group-item">
            <div class="media-body">
              <span>${messageAuthor} in ${messageSource}</span><br>
              <b>${element.subject}</b>
              <p>${element.body_html}</p>
              <i>${moment.unix(element.created_utc).fromNow()}</i>
            </div>
          </li>
          `})
        })
      }
      )

      myConsole.log('old: ' + notifications);
      myConsole.log('new: ' + newNotifications);

      if (notifications == newNotifications || notifications == '') {
        myConsole.log('No new Messages');
        notifications = newNotifications;
      } else {
        myConsole.log('New Message!!!');
        notifications = newNotifications;

        let myNotification = new Notification('Reddit Notification', {
          body: 'You received a new Message or Reply'
        })
      }

    }
    newNotifications = '';
    document.querySelector('.footer-content').innerHTML = `Updated ${moment().format('MMMM Do YYYY, h:mm:ss a')}`;

  };

  loadMessages();

  document.addEventListener('click', (event) => {

    if (event.target.href) {
      // Open links in external browser
      shell.openExternal(event.target.href)
      event.preventDefault()
    } else if (event.target.classList.contains('js-refresh-action')) {
      updateNotifications()
    } else if (event.target.classList.contains('js-settings-action')) {
      toggleSettingsView()
    } else if (event.target.classList.contains('js-quit-action')) {
      window.close()
    }

  });

  const updateNotifications = () => {

    document.querySelector('.list-group').innerHTML = ``;
    loadMessages();
  }

  function toggleSettingsView() {

    if (document.querySelector('#login-overlay').style.display == 'none') {
      document.querySelector('#login-overlay').style.display = 'block';
    } else {
      document.querySelector('#login-overlay').style.display = 'none';
    }

  }

  document.querySelector("#submitButton").addEventListener("click", function () {

    if (document.querySelector("#useragent").value != '' &
      document.querySelector("#clientid").value != '' &&
      document.querySelector("#clientsecret").value != '' &&
      document.querySelector("#username").value != '' &&
      document.querySelector("#password").value != '') {

      store.set('useragent', document.querySelector("#useragent").value);
      store.set('clientid', document.querySelector("#clientid").value);
      store.set('clientsecret', document.querySelector("#clientsecret").value);
      store.set('username', document.querySelector("#username").value);
      store.set('password', document.querySelector("#password").value);

      myConsole.log("Values set");
      document.querySelector("#info").innerHTML = '';
      userAccount = new snoowrap({
        userAgent: document.querySelector("#useragent").value,
        clientId: document.querySelector("#clientid").value,
        clientSecret: document.querySelector("#clientsecret").value,
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value
      });
      updateNotifications();
    } else {
      myConsole.log("One or more values empty");
      document.querySelector("#info").innerHTML = 'Input fields cant be empty';
    }
  });


  // Refresh notifications
  setInterval(() => updateNotifications(), 2 * 60 * 1000);
});
