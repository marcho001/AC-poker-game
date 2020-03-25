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
  flipCard(item) {
    // 如果背面 翻正面
    
    if(item.classList.contains('back')){
      item.classList.remove('back')
      item.innerHTML = this.getCardContent(Number(item.dataset.index))
      return
    }

    item.classList.add('back')
    item.innerHTML = null
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
    view.displayCards(utility.getRandomNumberArray(52))
  }
}

const model = {
  // revraledCards 為被翻開的卡片
  revealedCards: []
}

controller.generateCards()

document.querySelectorAll('.card').forEach((item) => {
  item.addEventListener('click',(e) => {
    if(e.target.classList.contains('card')){
      view.flipCard(e.target)
    }       
  })
})