// Declarations
let interval1 = 0
let interval2 = 0
let frames1 = 0 
let frames2 = 0
let score1 = 0
let score2 = 0
const gravity = 0.98
let bananas1 = []
let bananas2 = []
let blocks1 = []
let blocks2 = []
let isCrashing1 = false
let isCrashing2 = false
let isChoosing1 = false
let isChoosing2 = false
let isThrowing1 = false
let isThrowing2 = false
/*let items1 = []
let items2 = []*/
const keys = []

const winner = 100
const coin = new Image()
coin.src = './assets/sprites/coin.ico'

const canvas1 = document.getElementById('board-1')
const ctx1 = canvas1.getContext('2d')

const canvas2 = document.getElementById('board-2')
const ctx2 = canvas2.getContext('2d')

//Classes
class Board {
  constructor(img, type) {
    this.x = 0,
    this.y = 0,
    this.img = new Image()
    this.img.src = img
    this.img.onload = () => this.draw()
    this.type = type
    this.audio = new Audio()
    this.audio.src = './assets/music/super_iron_kart.mp3'
    this.audio.loop = true
  }
  draw() {
    if(this.type) {
      if(this.x < -canvas1.width) this.x = 0
      ctx1.drawImage(this.img, this.x, this.y, canvas1.width, canvas1.height)
      ctx1.drawImage(this.img, this.x + canvas1.width, this.y, canvas1.width, canvas1.height)
    } else {
      if(this.x < -canvas2.width) this.x = 0
      ctx2.drawImage(this.img, this.x, this.y, canvas2.width, canvas2.height)
      ctx2.drawImage(this.img, this.x + canvas2.width, this.y, canvas2.width, canvas2.height)
    }
    this.x -= 2
  }
}

class Character {
  constructor(player, type) {
    this.x = 20
    this.y = canvas1.height
    this.img = new Image()
    this.img.src = './assets/characters/' + player + '.png'
    this.img.onload = () => this.draw()
    this.type = type
    this.width = 70
    this.height = 80
    this.item = false
    this.sprite = new Image()
    this.sprite.src = './assets/sprites/' + player +'_sprite.png'
    this.sx = 0
    this.sy = 0
    this.hit = new Audio()
    this.hit.src = './assets/music/hit.mp3'
    this.hit.loop = false
    this.jumping = new Audio()
    this.jumping.src = './assets/music/jump.mp3'
    this.jumping.loop = false
    this.iteming = new Audio()
    this.iteming.src = './assets/music/item.mp3'
    this.iteming.loop = false
    this.boost = new Audio()
    this.boost.src = './assets/music/boost.mp3'
    this.boost.loop = false
    this.coin = new Audio()
    this.coin.src = './assets/music/coin.mp3'
    this.coin.loop = false
    this.finish = new Audio()
    this.finish.src = './assets/music/finish.mp3'
    this.finish.loop = false
  }
  draw() {
    if(this.x < canvas1.width - this.width) this.x++
    if(this.type) {
      this.y += gravity
      ctx1.drawImage(this.img, this.x, this.y, this.width, this.height)
    } else {
      this.y += gravity
      ctx2.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
  }
  drawSprite(type) {
    if(this.sx > 375) this.sx = 0
    if(this.type) {
      ctx1.drawImage(
        this.sprite,
        this.sx,
        this.sy,
        31,
        31,
        this.x,
        this.y,
        this.width,
        this.height
      )
      this.sx += 31
      setTimeout(() => isCrashing1 = false, 1000) 
    } else {
      ctx2.drawImage(
        this.sprite,
        this.sx,
        this.sy,
        31,
        31,
        this.x,
        this.y,
        this.width,
        this.height
      )
      this.sx += 31
      setTimeout(() => isCrashing2 = false, 1000)
    }
  }
  isTouching(item) {
    return (this.x < item.x + item.width) &&
            (this.x + this.width - 40 > item.x + 40) &&
            (this.y < item.y + item.height ) &&
            (this.y + this.height + 40 > item.y + 40)
  }
  speedUp() {
    if(this.x < canvas2.width - this.width) this.x += 2
  }
  speedDown() {
    if(this.x > 0) this.x -= 5
  }
  jump() {
    this.jumping.play()
    if(this.y > canvas1.height - this.height - 1) this.y -= 100
  }
}

class Banana {
  constructor(type) {
    this.x = canvas1.width
    this.y = canvas1.height - 40
    this.width = 40
    this.height = 40
    this.type = type
    this.img = new Image()
    this.img.src = './assets/characters/banana.png'
  }
  draw() {
    if(this.type) {
      ctx1.drawImage(this.img, this.x, this.y, this.width, this.height)
    } else {
      ctx2.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    this.x--
  }
}

class Block {
  constructor(type) {
    this.x = canvas1.width
    this.y = canvas1.height - 130
    this.width = 40
    this.height = 40
    this.type = type
    this.img = new Image()
    this.img.src = './assets/sprites/block.ico'
  }
  draw() {
    if(this.type) {
      ctx1.drawImage(this.img, this.x, this.y, this.width, this.height)
    } else {
      ctx2.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    this.x--
  }
}

class Item {
  constructor(x, type) {
    this.x = x
    this.y = canvas1.height - 40
    this.width = 40
    this.height = 40
    this.img = new Image()
    this.img.src = './assets/sprites/shell.png'
    this.type = type
    this.where = false
    this.audio = new Audio()
    this.audio.src = './assets/music/throw.mp3'
    this.audio.loop = false
  }
  draw() {
    if(this.type) {
      if(this.x < canvas1.width + this.width && !this.where) {
        ctx1.drawImage(this.img, this.x, this.y, this.width, this.height)
        this.x += 10
      } else {
        this.where = true
        ctx2.drawImage(this.img, this.x, this.y, this.width, this.height)    
        this.x -= 10
      }
    } else {
      if(this.x < canvas2.width + this.width && !this.where) {
        ctx2.drawImage(this.img, this.x, this.y, this.width, this.height)
        this.x += 10
      } else {
        this.where = true
        ctx1.drawImage(this.img, this.x, this.y, this.width, this.height)    
        this.x -= 10
      }
    }
  }
}

class ItemBoard {
  constructor(type, sprite = './assets/sprites/item_board_sprite.png'){
    this.x = canvas1.width - 70
    this.y = 10
    this.width = 70
    this.height = 50
    this.img = new Image()
    this.img.src = './assets/sprites/item_board.png'
    this.imgCoin = new Image()
    this.imgCoin.src = './assets/sprites/coin_board.png'
    this.imgMushroom = new Image()
    this.imgMushroom.src = './assets/sprites/mush_board.png'
    this.imgShell = new Image()
    this.imgShell.src = './assets/sprites/shell_board.png'
    this.type = type
    this.sprite = new Image()
    this.sprite.src = sprite
    this.sx = 0
    this.sy = 0
  }
  draw() {
    if(this.type) {
      switch(character1.item) {
        case 'coin':
          ctx1.drawImage(this.imgCoin, this.x, this.y, this.width, this.height)
          break;
        case 'mushroom':
          ctx1.drawImage(this.imgMushroom, this.x, this.y, this.width, this.height)
          break;
        case 'shell':
          ctx1.drawImage(this.imgShell, this.x, this.y, this.width, this.height)
          break;
        default:
          ctx1.drawImage(this.img, this.x, this.y, this.width, this.height)
          break;
      }
    } else {
      switch(character2.item) {
        case 'coin':
          ctx2.drawImage(this.imgCoin, this.x, this.y, this.width, this.height)
          break;
        case 'mushroom':
          ctx2.drawImage(this.imgMushroom, this.x, this.y, this.width, this.height)
          break;
        case 'shell':
          ctx2.drawImage(this.imgShell, this.x, this.y, this.width, this.height)
          break;
        default:
          ctx2.drawImage(this.img, this.x, this.y, this.width, this.height)
          break;
      }
    }
  }
  drawSprite(type) {
    if(this.sx > 375) this.sx = 0
    if(this.type) {
      ctx1.drawImage(
        this.sprite,
        this.sx,
        this.sy,
        25,
        25,
        this.x,
        this.y,
        this.width,
        this.height
      )
      this.sx += 2
      setTimeout(() => isChoosing1 = false, 3000) 
    } else {
      ctx2.drawImage(
        this.sprite,
        this.sx,
        this.sy,
        25,
        25,
        this.x,
        this.y,
        this.width,
        this.height
      )
      this.sx += 2
      setTimeout(() => isChoosing2 = false, 3000)
    }
  }
}

// Definitions
const random_stage = Math.random() >= 0.5;

const board1 = new Board((random_stage) ? './assets/backgrounds/night.png' : './assets/backgrounds/day.png', true)
const board2 = new Board((random_stage) ? './assets/backgrounds/night.png' : './assets/backgrounds/day.png', false)

const character1 = new Character(playerOne, true)
const character2 = new Character(playerTwo, false)

const itemBoard1 = new ItemBoard(true)
const itemBoard2 = new ItemBoard(false)

// Main flow
function update() {
  frames1++
  frames2++
  score1++
  score2++
  ctx1.clearRect(0, 0, canvas1.width, canvas1.heigth)
  ctx2.clearRect(0, 0, canvas2.width, canvas2.heigth)
  board1.draw()
  board2.draw()
  if(!isCrashing1) character1.draw()
  else character1.drawSprite(true)
  
  if(!isCrashing2) character2.draw()
  else character2.drawSprite(false)

  keyListener()
  checkCollition()
  printScore()
  printItemBoard()
  generateBananas()
  drawBananas()
  removeBananas()
  generateBlocks()
  drawBlocks()
  removeBlocks()
  checkWinner()

  if(isThrowing1) throwItem(character1.x + character1.width, true)
  if(isThrowing2) throwItem(character2.x+ character2.width, false)

  if(character1.y >= canvas1.height - character1.height) {
    character1.y = canvas1.height - character1.height
  }

  if(character2.y >= canvas1.height - character2.height) {
    character2.y = canvas1.height - character2.height
  }
}

function startGame() {
  if(interval1) return
  if(interval2) return
  board1.audio.play()
  interval1 = setInterval(update, 1000 / 60)
  interval2 = setInterval(update, 1000 / 60)
}

// Helpers
function checkWinner() {
  if(Math.round((score1 / 1000) * 10) >= winner) {
    console.log('Winner player 1')
    board1.audio.pause()
    character1.finish.play()
    ctx1.font = 'bold 33px serif';
    ctx1.fillText('You won!', canvas1.width / 2 - 100, canvas1.height / 2)
    clearInterval(interval1)
    clearInterval(interval2)
  }
  if(Math.round((score2 / 1000) * 10) >= winner) {
    console.log('Winner player 2')
    board1.audio.pause()
    character2.finish.play()
    ctx2.font = 'bold 33px serif';
    ctx2.fillText('You won!', canvas2.width / 2 - 100, canvas2.height / 2)
    clearInterval(interval1)
    clearInterval(interval2)
  }
}

function generateBananas() {
  const random1 = Math.floor(Math.random() * 50);
  const random2 = Math.floor(Math.random() * 50);

  if(frames1 % (60 * random1) === 0) {
    const banana = new Banana(true)
    bananas1.push(banana)
  }
  if(frames2 % (60 * random2) === 0) {
    const banana = new Banana(false)
    bananas2.push(banana)
  }
}

function generateBlocks() {
  const random1 = Math.floor(Math.random() * 50);
  const random2 = Math.floor(Math.random() * 50);

  if(frames1 % (60 * random1) === 0) {
    if(!character1.item) {
      const block = new Block(true)
      blocks1.push(block)
    }
  }
  if(frames2 % (60 * random2) === 0) {
    if(!character2.item) {
      const block = new Block(false)
      blocks2.push(block)
    }
  }
} 

function generateItems() {}

function removeBananas() {
  bananas1 = bananas1.filter(banana => banana.x > 0)
  bananas2 = bananas2.filter(banana => banana.x > 0)
}

function removeBlocks() {
  blocks1 = blocks1.filter(block => block.x > 0)
  blocks2 = blocks2.filter(block => block.x > 0)
}

function printScore() {
  if(score1 < 0) score1 = 0
  if(score2 < 0) score2 = 0
  ctx1.drawImage(coin, 5, 20, 20, 20)
  ctx1.font = 'bold 33px serif';
  ctx1.fillStyle = (random_stage) ? 'white' : 'black'
  ctx1.fillText(Math.round((score1 / 1000) * 10), 30, 40)
  ctx2.drawImage(coin, 5, 20, 20, 20)
  ctx2.font = 'bold 33px serif';
  ctx2.fillStyle = (random_stage) ? 'white' : 'black'
  ctx2.fillText(Math.round((score2 / 1000) * 10), 30, 40)
}

function printItemBoard() {
  if(!isChoosing1) itemBoard1.draw()
  else itemBoard1.drawSprite(true)

  if(!isChoosing2) itemBoard2.draw()
  else itemBoard2.drawSprite(false)
}

function drawBananas() {
  bananas1.forEach(banana => banana.draw())
  bananas2.forEach(banana => banana.draw())
}

function drawBlocks() {
  blocks1.forEach(block => block.draw())
  blocks2.forEach(block => block.draw())
}

function checkCollition() {
  bananas1.forEach(banana => {
    if(character1.isTouching(banana)){
      score1 -= 50
      character1.hit.play()
      isCrashing1 = true
    }
  })
  bananas2.forEach(banana => {
    if(character2.isTouching(banana)){
      score2 -= 50
      character2.hit.play()
      isCrashing2 = true
    }
  })

  for(let i = 0; i < blocks1.length; i++) {
    if(character1.isTouching(blocks1[i])){
      character1.iteming.play()
      const randomItem = Math.floor(Math.random() * 3) + 1
      switch(randomItem) {
        case 1:
          character1.item = 'coin'
          isChoosing1 = true
          break;
        case 2:
          character1.item = 'mushroom'
          isChoosing1 = true
          break;
        case 3:
          character1.item = 'shell'
          isChoosing1 = true
          break;
        default:
          break;
      }
    }
  }

  blocks2.forEach(block => {
    if(character2.isTouching(block)){
      character2.iteming.play()
      const randomItem = Math.floor(Math.random() * 3) + 1
      switch(randomItem) {
        case 1:
          character2.item = 'coin'
          isChoosing2 = true
          break;
        case 2:
          character2.item = 'mushroom'
          isChoosing2 = true
          break;
        case 3:
          character2.item = 'shell'
          isChoosing2 = true
          break;
        default:
          break;
      }
    }
  })
}

function throwItem(x, where) {
  let shell = new Item(x, where)
  shell.audio.play()
  let speeder = setInterval(() => {
    shell.draw()
    if(where) { //Threw player 1
      if(character2.isTouching(shell) && shell.where) {
        character2.hit.play()
        score2 -= 1000
        isCrashing2 = true 
      }
    }
    else { //Threw player 2
      if(character1.isTouching(shell) && shell.where) {
        character1.hit.play()
        score1 -= 1000
        isCrashing1 = true 
      }
    }
    if(shell.x < 0) clearInterval(speeder)
  }, 0)
  if(where) isThrowing1 = false
  else isThrowing2 = false
}


function keyListener() {
  if(keys[40]) { // arrow down
    switch(character1.item) {
      case 'shell':
        isThrowing1 = true
        character1.item = false
        break;
      case 'coin':
        score1 += 1000
        character1.coin.play()
        character1.item = false
        break;
      case 'mushroom':
        score1 += 500
        character1.boost.play()
        let speeder = setInterval(() => {
          if(character1.x <  canvas1.width - character1.width - 1) character1.x += 5
          if(frames1 % 120 === 0) clearInterval(speeder)
        }, 0)
        
        character1.item = false
        break;
      default:
        break;
    }
  }
  if(keys[38]) character1.jump() //arrow up
  if(keys[39]) character1.speedUp() //arrow left
  if(keys[37]) character1.speedDown() //arrow rigth
  if(keys[88]) { // X
    switch(character2.item) {
      case 'shell':
        isThrowing2 = true
        character2.item = false
        break;
      case 'coin':
        score2 += 1000
        character2.coin.play()
        character2.item = false
        break;
      case 'mushroom':
        score2 += 500
        character2.boost.play()
        
        let speeder = setInterval(() => {
          if(character2.x <  canvas2.width - character2.width - 1) character2.x += 5
          if(frames2 % 120 === 0) clearInterval(speeder)
        }, 0)
        
        character2.item = false
        break;
      default:
        break;
    }
  }
  if(keys[83]) character2.jump() // S
  if(keys[67]) character2.speedUp() // C
  if(keys[90]) character2.speedDown() // Z
}

// Listeners
document.addEventListener('keydown', e => {
  keys[e.keyCode] = true
  switch(e.keyCode) {
    case 13:
      startGame()
      break;
  }
})

document.body.addEventListener('keyup', e => {
  keys[e.keyCode] = false
})

// Disable scroll keys
window.addEventListener("keydown", function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {e.preventDefault();}
}, false);
