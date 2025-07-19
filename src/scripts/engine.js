const state = { // Objetos práticos para manipular corretamente os elementos HTML
    score:{ // Placar
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites:{ // Imagens
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{ // Jogadores
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    actions: { // Ações de botões
        button: document.getElementById("next-duel")
    }
}

const playerSides = { // Enumeração dos jogadores
    player1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/" // Instanciar a imagem

const cardData = [ // Enumerando das cartas do jokenpo
   {
    id:0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf:[1],
    loseOf:[2]
   },

    {
    id:1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf:[2],
    loseOf:[0]
   },

    {
    id:2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf:[0],
    loseOf:[1]
   }
]

async function getRandomCardId() { // Retorna um id aleatório
    const randomIndex = Math.floor(Math.random() * cardData.length)
    // Usando o Math.floor para não pegar um número quebrado
    return cardData[randomIndex].id // Retorna o id
}

async function createCardImage(IdCard, fieldSide){ // Função para criar um HTML
    const cardImage = document.createElement("img") // Criando uma imagem
    cardImage.setAttribute("height", "100px") // Setando altura e o número
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png") // Pegando a imagem
    cardImage.setAttribute("data-id", IdCard) // Id da carta
    cardImage.classList.add("card") // Classe para usar no CSS

    if(fieldSide === playerSides.player1){ 
        cardImage.addEventListener("mouseover", () =>{ 
        drawSelectCard(IdCard)
        })
        // Quando passar o mouse por cima, vai aparecer a carta ao lado para identificar

        // Vai fazer uma comparação para adicionar as cartas no campo
        cardImage.addEventListener("click", () =>{ // Evento de click ao selecionar a carta 
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }

    return cardImage
}

async function setCardsField(cardId){

    // Remove todas as cartas antes
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId() // Recebendo uma carta aleatória do sorteio

    state.fieldCards.player.style.display = "block" // Colocando display block
    state.fieldCards.computer.style.display = "block" // Colocando display block

    state.fieldCards.player.src = cardData[cardId].img // Setando as cartas do player
    state.fieldCards.computer.src = cardData[computerCardId].img 
    // Setando as cartas do computer

    let duelResults = await checkDuelResults(cardId, computerCardId) // Checa o resultado

    await updateScore() // Atualiza o score
    await drawButton(duelResults) // Altera o botão (Ganhou ou perdeu)
}

async function drawSelectCard(index){ // Função para selecionar a carta
    state.cardSprites.avatar.src = cardData[index].img // Pega imagem
    state.cardSprites.name.innerText = cardData[index].name // Pega nome
    state.cardSprites.type.innerText = "Attibute :" + cardData[index].type // Pega o tipo
}

async function drawCards(cardNumbers, fieldSide){ 
    // Função que vai sortear um id para fornecer as cartas aleatoriamente
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId() // Pega um Id aleatório
        const cardImage = await createCardImage(randomIdCard, fieldSide) // Guardar a imagem da carta

        document.getElementById(fieldSide).appendChild(cardImage) 
        // Mostra uma imagem aleatória
    }
}

function init(){ // Inicializar o game
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)
}

init()