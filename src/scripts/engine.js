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

    playerSides:{ // Enumeração dos jogadores
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },

    actions:{ // Ações de botões
        button: document.getElementById("next-duel")
    }
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

    if(fieldSide === state.playerSides.player1){ 
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
    // Foi utilizado a técnica (Extract to Method) que serve como uma função que executa várias funções, encurtando e melhorando o nosso código
    
    await removeAllCardsImages()// Remove todas as cartas antes

    let computerCardId = await getRandomCardId() // Recebendo uma carta aleatória do sorteio

    await showHiddenCardFieldsImages(true)

    await hiddenCardsDetails()

    await drawCardsInFields(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId) // Checa o resultado

    await updateScore() // Atualiza o score
    await drawButton(duelResults) // Altera o botão (Ganhou ou perdeu)
}

async function drawCardsInFields(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img 
    // Setando as cartas do player
    state.fieldCards.computer.src = cardData[computerCardId].img 
    // Setando as cartas do computer
}

async function showHiddenCardFieldsImages(value){
    if(value === true){ // Verificando se for verdadeiro
        state.fieldCards.player.style.display = "block" // Colocando display block
        state.fieldCards.computer.style.display = "block" // Colocando display block
    }

    if(value === false){ // Verificando se for falso
        state.fieldCards.player.style.display = "none" // Tirando o display
        state.fieldCards.player.style.display = "none" // Tirando o display
    }
}

async function hiddenCardsDetails(){ // Detalhes das cartas
    // Ao selecionar a carta, no lado esquerdo some as informações dela
    
    state.cardSprites.avatar.src = "" // Colocando texto vazio

    state.cardSprites.name.innerHTML = "" // Colocando texto vazio
    state.cardSprites.type.innerHTML = "" // Colocando texto vazio
}

async function drawButton(text){ // Aparece se você ganhou ou perdeu
    state.actions.button.innerText = text.toUpperCase()

    state.actions.button.style.display = "block" // Display block
}

async function checkDuelResults(playerCardId, ComputerCardId){ 
    // Checando quem ganhou busncando pelo Id

    let duelResults = "Draw" // Padrão empate
    let playerCard = cardData[playerCardId] // Pegando a carta do player

    if(playerCard.winOf.includes(ComputerCardId)){ // Caso ganhe
        duelResults = "Win" // Caso ganhe a disputa
        state.score.playerScore++ // Adicionando o score
    }

    if(playerCard.loseOf.includes(ComputerCardId)){ // Caso perca
        duelResults = "Lose" // Caso ganhe a disputa
        state.score.computerScore++ // Adicionando o score
    }
    
    await playAudio(duelResults) // Áudio de vitória

    return duelResults // Retorna o resultado
}

async function updateScore(){ // Atualizando o placar
    state.score.scoreBox.innerHTML = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}` // Incrementando visualmente
}

async function removeAllCardsImages(){ 
    // Quando escolher as cartas, o banco some para não selecionar outra
    
    let {computerBOX, player1BOX} = state.playerSides// Buscando o document com o state
    let imgElements = computerBOX.querySelectorAll("img") // Pegar as imagens das cartas
    imgElements.forEach((img) => img.remove()) // Remover as cartas

    imgElements = player1BOX.querySelectorAll("img") // Pegar as imagens das cartas
    imgElements.forEach((img) => img.remove()) // Remover as cartas

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

async function resetDuel(){ // Reseta o duelo
    state.cardSprites.avatar.src = "" // Colocando o card vazio
    state.actions.button.style.display = "none" // Botão com display none

    state.fieldCards.player.style.display = "none" // Resetando com display none
    state.fieldCards.computer.style.display = "none" // Resetando com display none

    init() 
}

async function playAudio(status){ // Colocando áudio
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try{
        audio.play() // Chamando a função
    }catch{}
}

function init(){ // Inicializar o game

    showHiddenCardFieldsImages(false)

    drawCards(5, state.playerSides.player1),
    drawCards(5, state.playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play() // Colocando uma música de fundo
}

init()