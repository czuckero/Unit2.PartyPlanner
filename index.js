// Storing the API in a variable
const partiesAPI = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events`;

// Creating a state variable to be altered
const state = {
  parties: [],
}

// Storing the 
const partyList = document.querySelector("#parties");

// Async function to update the DOM with the parties we get from the API
async function render() {
  await getParties();
  renderParties();
};

render();

// Async function to retrieve the parties in the API 
async function getParties() {
  try {
    const response = await fetch(partiesAPI);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.log(error);
  }
};

console.log(state);

// Function to map through the array of parties stored in the state object
// and create new list elements/party cards in the DOM
function renderParties() {
  const partyCards = state.parties.map((party) => {
    const liElement = document.createElement("li");
    liElement.innerHTML = `
    <h3>${party.name}</h3>
    <p>${party.date}</p>
    <p>${party.location}</p>
    <p>${party.description}</p>`;
    
    // delete button created for each list element
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    liElement.append(deleteButton);
    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return liElement;
  });
  partyList.replaceChildren(...partyCards);
};

// Storing the form in a variable and then listening for a submit event
const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

// Async function to create a new party to add to the API
async function createParty(name, date, location, description) {
  
  try {
    const response = await fetch(partiesAPI, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name, date, location, description}),
    });
    const json = await response.json();
    console.log("New party", json);
  
    if (json.error) {
      throw new Error(json.message);
    };
    render();
  } catch (error) {
    console.log(error);
  }; 
};

// Async function to call the createParty function with the respective arguments 
// and add them to the API
async function addParty(event) {
  event.preventDefault();
  await createParty(
    addPartyForm.name.value,
    addPartyForm.date.value,
    addPartyForm.location.value,
    addPartyForm.description.value
  );
}

// Async function to delete party based on the ID it is given
async function deleteParty(id) {

  try {
    console.log(id);
    const response = await fetch(`${partiesAPI}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Party could not be deleted.");
    };
    render();
  } catch (error) {
    console.error(error);
  };
};
