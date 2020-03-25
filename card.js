// 定義遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {
  // key的名稱跟value的名稱相同可省略
  // 運算隨機插入卡片的content 的function
  getCardElement(index) {    
    return `<div data-index="${index}" class="card back"></div>`
  },
  getCardContent(index){
    const cardNum = (index % 13) + 1
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${this.transformNumber(cardNum)}</p>
      <img src="${symbol}" alt="card's image">
      <p>${this.transformNumber(cardNum)}</p>
    `
  },
  // 轉換JQKA的function
  transformNumber(num) {
    switch(num){
      case 1:
        return 'A'
        break;
      case 11:
        return 'J'
        break;
      case 12:
        return 'Q'
        break;
      case 13:
        return 'K'
        break;
      default:
        return num
    }
  },
  // 插入的function
  displayCard(indexes) {
    document.querySelector('#card').innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  // 點擊翻牌function
  flipCards(...cards) {
    // 如果背面 翻正面
    cards.map(card =>{
      if(card.classList.contains('back')){
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      return
    }

    card.classList.add('back')
    card.innerHTML = null
    })
    
  },
  pairCards(...cards){
    cards.map(card => card.classList.add('paired'))    
  },
  renderScore(score){
    document.querySelector('.score').innerHTML = `Score: ${score}`
  },
  renderTrideTimes(times){
    document.querySelector('.tried').innerHTML = `You've tried: ${times} times`
  },
  appendWrongAnimation(...cards){
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend',e =>
      e.target.classList.remove('wrong'),{ once : 'ture' })
    })
  }
}

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

const controller = {
  // 遊戲初始狀況
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards(){
    view.displayCard(utility.getRandomNumberArray(52))
  },
  dispatchCardAction(card){
    if(!card.classList.contains('back')){
      return
    }
    switch (this.currentState){
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        model.revealedCards.push(card)
        break
      case GAME_STATE.SecondCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        view.renderTrideTimes(++model.tried)
        // 翻得牌有沒有一樣
        if(model.isRevealedCardsMatched()){
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardAwaits

        } else{
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards,1000)
        }
        break
    }console.log(this.currentState)
    console.log(model.revealedCards.map(i => i.dataset.index))
  },
  resetCards(){
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}

const model = {
  // revraledCards 為被翻開的卡片
  revealedCards: [],
  isRevealedCardsMatched(){
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
    
  },
  score: 0,
  tried: 0
}

controller.generateCards()

document.querySelectorAll('.card').forEach((item) => {
  item.addEventListener('click',(e) => {
      controller.dispatchCardAction(e.target)      
  })
})