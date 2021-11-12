const main = document.querySelector("main");
//every 3 seconds, reload messages
    //if there are new messages, scroll to end (scrollIntoView)
    //if private message,
        //if names dont match, hide message

//enter room POST
enterRoom();

//maintain connection (check every 5s, setInterval?) POST

//search messages GET

//send messages POST

function enterRoom() {
    //ask for name
    const name = prompt("Qual é o seu nome, viajante das interwebs?");
    //send name to API
    const pParticipants = axios.post(
        "https://mock-api.driven.com.br/api/v4/uol/participants",
        {
            name
        }
    )

    pParticipants.then(usernameSuccess);
    pParticipants.catch(usernameError);

}
//sucesso:
function usernameSuccess(response){
    //grab info from messages api
    const pMessages = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    pMessages.then(fetchData);
    
}

//erro:
function usernameError(status){
    alert("Esse nome já está em uso. Por favor, tente novamente.");
    enterRoom();
}

function renderMessage(from,to,text,type,time) {
    main.innerHTML += 
    `
        <div class="${type}">
            <p><span>(${time}) </span> <strong>${from}</strong> para <strong>${to}</strong>: ${text}</p>
        </div>
    `;
}

function fetchData(response){
    const from = response[Object.keys(response)[Object.keys(response).length-1]].from;
    renderMessage(from,'you','ayyy lmao','normal','00:00:00');
}