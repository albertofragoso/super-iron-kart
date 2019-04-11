let playerOne = ''
let playerTwo = ''
const container = document.querySelector('.container')

let buttons1 = document.querySelectorAll('.button-one')
buttons1.forEach(button => {
  button.onclick = e => {
    container.removeChild(document.getElementById('player1'))
    document.getElementById('player2').style.display = 'flex'
    playerOne = e.target.alt
  }
})

let buttons2 = document.querySelectorAll('.button-two')
buttons2.forEach(button => {
  button.onclick = e => {
    container.removeChild(document.getElementById('player2'))
    playerTwo = e.target.alt

    //Add canvas to html
    const canv1 = document.createElement('canvas');
    canv1.id = 'board-1';
    canv1.width = '800'
    canv1.height = '300'
    document.body.appendChild(canv1);
    
    const canv2 = document.createElement('canvas');
    canv2.id = 'board-2';
    canv2.width = '800'
    canv2.height = '300'
    document.body.appendChild(canv2);

    const h1 = document.createElement('h1');
    h1.innerHTML = 'press enter to start'
    document.body.appendChild(h1);

    //Add app.js to html
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "./js/app.js";
    document.body.appendChild(s);
  }
})