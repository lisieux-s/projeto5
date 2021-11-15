const main = document.querySelector("main");
//every 3 seconds, reload messages
//if there are new messages, scroll to end (scrollIntoView)
//if private message, only show to recipient
//if names dont match, hide message

// ♥ search messages GET
// ♥ enter room POST 
loadMessages();
enterRoom();

//maintain connection (check every 5s, setInterval?) POST


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
    const text = document.querySelector("input").value;
    const pSend = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
    {
        text
    }
    )
    //make typed stuff disappear

    pSend.then(sendSuccess);
}

//sucesso:
function sendSuccess(response) {
    //grab info from messages api
    const pMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    pMessages.then(fetchSingularMessage);

}


//erro:
function usernameError(status) {
    alert('Esse nome já está em uso. Por favor, tente novamente.');
    enterRoom();
}

function renderMessage(from, to, text, type, time) {
    if (type === 'message') {
        if (to !== 'Todos') {
            main.innerHTML +=
                `
        <div class="private">
            <p><span>(${time}) </span> <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
        } else {
            main.innerHTML +=
                `
        <div class="normal">
            <p><span>(${time}) </span> <strong>${from}</strong> para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
        }

    } else if (type === 'status') {
        main.innerHTML +=
            `
        <div class="${type}">
            <p><span>(${time}) </span> <strong>${from}</strong> ${text}</p>
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
    const to = lastMessage.to;
    const text = lastMessage.text;
    const type = lastMessage.type;
    const time = lastMessage.time;
    renderMessage(from, to, text, type, time);
}

function fetchMessages(response){
    //get lenght of array
    const messages = response.data;

    //call each message
    for(let i = 0; i < messages.length; i++) {
        const from = messages[i].from;
        const to = messages[i].to;
        const text = messages[i].text;
        const type = messages[i].type;
        const time = messages[i].time;
        renderMessage(from, to, text, type, time);
    }

}
