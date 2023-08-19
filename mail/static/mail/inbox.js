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
  document.querySelector('#view-mail').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function readmail(id, mailbox){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    }),
});
read_mail(id, mailbox);
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


  const p = document.getElementById('emails-view');
  p.style.width = '100%';

  p.style.animation = 'view 2s ease-in-out paused reverse';
  p.style.animationPlayState = 'running';
  document.querySelector('#emails-view').addEventListener("animationend", function() {
    this.style.animation = "none";
  });
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      emails.forEach(email => {
        console.log(email);
        const element = document.createElement('div');
        element.className = email.read ? 'read' : 'unread';
        if (mailbox === 'inbox'){
          element.innerHTML = `From : <h6>${email.sender}</h6>
          <h4>Subject : ${email.subject}</h4>
          <p>${email.timestamp}</p>`;
        }
        if (mailbox === 'archive'){
          element.innerHTML = `From : <h6>${email.sender}</h6>
          <h4>Subject : ${email.subject}</h4>
          <p>${email.timestamp}</p>`;
        }
        if (mailbox === 'sent'){
          element.innerHTML = `To : <h6>${email.recipients}</h6>
          <h4>Subject : ${email.subject}</h4>
          <p>${email.timestamp}</p>`;
        }
        
        element.addEventListener('click', function(){
          const ele = document.getElementById('emails-view');
          if(ele.style.width === '100%'){
            ele.style.animation = 'view 2s ease-in-out paused normal';
            ele.style.animationPlayState = 'running';
          }
          ele.style.width = '50%';
          document.querySelector('#view-mail').style.display = 'block';
          readmail(email.id, mailbox);
          element.style.backgroundColor = "lightgray";
          console.log('This element has been clicked!');
          });
        document.querySelector('#emails-view').append(element);
        });
  });
}

function read_mail(id, mailbox){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    const btn = document.createElement('button');
    btn.innerHTML = email.archived ? 'Unarchive' : 'Archive';
    btn.className = email.archived ? 'btn btn-danger' : 'btn btn-success';
    btn.style.margin = '10px';
    btn.addEventListener('click',function(){
      console.log('button clicked');
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: !email.archived
        }),
    }).then(()=>{load_mailbox('archive');});
    })

    const reply = document.createElement('button');
    reply.innerHTML = 'Reply';
    reply.className = 'btn btn-info';
    reply.addEventListener('click',function(){
      console.log('button clicked');
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        let subject = email.subject;
        if(subject.split(' ',1)[0] != 'Re:'){
          subject = `Re: ${email.subject}`}
        document.querySelector('#compose-subject').value = `${subject}`;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote ${email.body}`;s
    });

    // ... do something else with email ...
    const e = document.querySelector('#view-mail');
    e.style.animationPlayState = 'running';
    const f = document.querySelector('#emails-view');
    const windheight = window.innerHeight;
    f.style.height = windheight + 'px';
    e.innerHTML = `
                  <div id='sub'><h4>From : ${email.sender}</h4>
                  <h2>Subject : ${email.subject}</h2>
                  <p><b>${email.timestamp}</b></p></div>
                  <p id='context'>${email.body}</p>`
    e.append(btn);
    if(mailbox != 'sent'){
    e.append(reply);
    }
  });
  }
