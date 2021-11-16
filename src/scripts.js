const main = document.querySelector("main");

//if there are new messages, scroll to end (scrollIntoView)
//if private message, only show to recipient
//if names dont match, hide message

// ♥ search messages (GET)
loadMessages();

// ♥ enter room (POST) 
var username = "" //this stores the username for use in multiple functions
enterRoom();
userStatus();

// ♥ maintain connection
setInterval(userStatus, 5000);
function userStatus() {
    const name = username;
    const pStatus = axios.post('https://mock-api.driven.com.br/api/v4/uol/status',
        {
            name
        }
    )
}

// ♥ every 3 seconds, reload messages
setInterval(loadMessages, 3000);
function loadMessages() {
    const pMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages')

    pMessages.then(fetchMessages);
}

function enterRoom() {
    //ask for name
    const name = prompt('Qual é o seu nome, viajante das interwebs?');
    //send name to API
    const pParticipants = axios.post(
        'https://mock-api.driven.com.br/api/v4/uol/participants',
        {
            name
        }
    )

    pParticipants.then(sendSuccess);
    pParticipants.catch(usernameError);

}

//send messages POST
function sendMessage() {
    //get what the user typed
    const from = username;
    const to = 'Todos';
    const text = document.querySelector("input").value;
    const type = 'message';
    console.log(from);
    console.log(text);

    const pSend = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
        {
            from,
            to,
            text,
            type
        }
    )
    //make typed stuff disappear

    pSend.then(sendSuccess);
}

//success:
function sendSuccess(response) {
    //grab info from messages api
    const pMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    pMessages.then(fetchSingularMessage);

}


//error when sending username:
function usernameError(status) {
    alert('Esse nome já está em uso. Por favor, tente novamente.');
    enterRoom();
}

function renderMessage(from, to, text, type, time) {
    if (type === 'private_message') {
        if (to === username) {
            main.innerHTML +=
                `
        <div class="private" data-identifier="message">
            <p><span class="time">(${time}) </span> <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
        }
    } else if (type === 'message') {
        main.innerHTML +=
            `
        <div class="normal" data-identifier="message">
            <p><span class="time">(${time}) </span> <strong>${from}</strong> para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
    } else if (type === 'status') {
        main.innerHTML +=
            `
        <div class="${type}" data-identifier="message">
            <p><span class="time">(${time}) </span> <strong>${from}</strong> ${text}</p>
        </div>
    `;
    }

}
function renderLastMessage(from, to, text, type, time) {
    if (type === 'private_message') {
        if (to === username) {
            main.innerHTML +=
                `
        <div class="private last-message" data-identifier="message">
            <p><span class="time">(${time}) </span> <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
        }
    } else if (type === 'message') {
        main.innerHTML +=
            `
        <div class="normal last-message" data-identifier="message">
            <p><span class="time">(${time}) </span> <strong>${from}</strong> para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
    } else if (type === 'status') {
        main.innerHTML +=
            `
        <div class="${type} last-message" data-identifier="message">
            <p><span class="time">(${time}) </span> <strong>${from}</strong> ${text}</p>
        </div>
    `;
    }

}

function fetchSingularMessage(response) {
    //access last item
    const messages = response.data;
    const lastMessage = messages[messages.length - 1];

    //call info 
    const from = lastMessage.from;
    username = from;
    const to = lastMessage.to;
    const text = lastMessage.text;
    const type = lastMessage.type;
    const time = lastMessage.time;
    renderMessage(from, to, text, type, time);
}

function fetchMessages(response) {
    //clear previous fetchMessages
    main.innerHTML = `

    `;

    //get lenght of array
    const messages = response.data;
    //call each message
    for (let i = 0; i < messages.length; i++) {
        const from = messages[i].from;
        const to = messages[i].to;
        const text = messages[i].text;
        const type = messages[i].type;
        const time = messages[i].time;
        renderMessage(from, to, text, type, time);
        if (i == messages.length) {
            renderLastMessage(from, to, text, type, time);
        }
    }
    document.querySelector('.last-message').scrollIntoView;

}
