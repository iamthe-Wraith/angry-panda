import './styles.scss';

const root = document.querySelector('#root');

const header = document.createElement('h1');
header.appendChild(document.createTextNode('Angry Panda'));
root.appendChild(header);

const panda = document.createElement('div');
panda.id = 'panda';

panda.innerHTML = `
  <div class="ear left"></div>
  <div class="ear right"></div>
  <div class="face">
    <div class="eye left"></div>
    <div class="nose"></div>
    <div class="eye right"></div>
    <div class="mouth"></div>
  </div>
  <div class="body">
    <div class="arm left"></div>
    <div class="arm right"></div>
  </div>`;

root.appendChild(panda);
