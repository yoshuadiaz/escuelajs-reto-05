
const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const NEXT_FETCH_KEY = 'next_fetch'

const State = {
  firstTime: true,
  get isFirstTime(){
    return this.firstTime
  },
  set isFirstTime(val){
    this.firstTime = val
  }
}

const getData = api => {
  return fetch(api)
    .then(response => response.json())
    .catch(error => console.log(error));
}

const parseResults = (results) => {
    const characters = results;
    let output = characters.map(character => {
      return `
    <article class="Card">
      <img src="${character.image}" />
      <h2>${character.name}<span>${character.species}</span></h2>
    </article>
  `
    }).join('');
    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output;
    $app.appendChild(newItem);
}

// Cómo decía el problema, cambie la función LoadData a Async/Await
const loadData = async () => {
  const nextFetch = localStorage.getItem(NEXT_FETCH_KEY)
  const url = State.isFirstTime ? API : nextFetch
  if(!State.isFirstTime && nextFetch === '') {
    intersectionObserver.unobserve($observe)
    const newItem = document.createElement('section');
    newItem.innerHTML = 'Ya no hay personajes...'
    $app.appendChild(newItem);
  } else {
    try {
      const response = await getData(url);
      if ('localStorage' in window) {
        localStorage.setItem('next_fetch', response.info.next)
      } else {
        throw new Error('Error on try to set localStorage')
      }
      parseResults(response.results)
    } catch (error) {
      throw new Error(`Error on loadData: ${error.message}`)
    }
  }
  State.isFirstTime = false
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    try {
      loadData();
    } catch (error) {
      console.log('OH NO')
    }
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);