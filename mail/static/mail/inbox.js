document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_mail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function send_mail(event) {
  event.preventDefault();
  console.log("mail sending page");
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log(recipients);
  console.log(subject);
  console.log(body);
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //if (mailbox === 'inbox'){
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(email => {
        const element = document.createElement('div');
        let sender = document.createElement('div');
        sender.innerHTML = <h4>`${email.sender}`</h4>;
        let sub = document.createElement('div');
        sub.innerHTML = <h2>`${email.subject}`</h2>;
        let time = document.createElement('div');
        time.innerHTML = <p>`${email.timestamp}`</p>;
        element.append(sender);
        element.append(sub);
        element.append(time);
        element.addEventListener('click', () => {
            console.log('This element has been clicked!')
          });
        document.querySelector('#emails-view').append(element);
        });
    });
  }
//}