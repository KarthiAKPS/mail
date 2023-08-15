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

function send_mail(event){
  event.preventDefault();
  console.log('entered send')
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
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
  document.querySelector('#view-mail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(email => {
        const element = document.createElement('div');
        element.className = email.read ? 'read' : 'unread';
        if (element.className == 'read'){
          element.style.backgroundColor = 'grey';
        }
        if (mailbox === 'inbox'){
          element.innerHTML = `From : <h4>${email.sender}</h4>
          <h2>Subject : ${email.subject}</h2>
          <p>${email.timestamp}</p>`;
        }
        if (mailbox === 'sent'){
          receiver.innerHTML = `To : <h4>${email.recipients}</h4>
          <h2>Subject : ${email.subject}</h2>
          <p>${email.timestamp}</p>`;
        }
        element.addEventListener('click', function(){
          document.querySelector('#view-mail').style.display = 'block';
          read_mail(email.id);
          console.log('This element has been clicked!');
          });
        document.querySelector('#emails-view').append(element);
        });
    });
  }
function read_mail(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...
    let e = document.querySelector('#view-mail');
    const f = document.querySelector('#emails-view');
    const windheight = window.innerHeight;
    f.style.height = windheight + 'px';
    e.innerHTML = `<h4>From : ${email.sender}</h4>
                    <h2>Subject : ${email.subject}</h2>
                    <p><b>${email.timestamp}</b></p>
                    <p>${email.body}</p>`
  });
  }