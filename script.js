// Elements
const setupEl = document.getElementById('setup');
const punchEl = document.getElementById('punchline');
const newBtn = document.getElementById('newJoke');
const tweetBtn = document.getElementById('tweet');
const statusEl = document.getElementById('status');
const jokeCard = document.getElementById('joke');

// Local fallback jokes
const fallback = [
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field." },
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything." },
  { setup: "Why did the math book look sad?", punchline: "Because it had too many problems." },
  { setup: "Why did the computer show up at work late?", punchline: "It had a hard drive." },
  { setup: "What did the ocean say to the beach?", punchline: "Nothing — it just waved." }
];

// Show loading
function setLoading(on=true){
  if(on){
    statusEl.innerHTML = '<span class="spinner" aria-hidden="true"></span> Loading...';
    newBtn.disabled = true;
  } else {
    statusEl.textContent = 'Ready';
    newBtn.disabled = false;
  }
}

// Animate joke card
function animateJoke(){
  jokeCard.style.opacity = '0.6';
  jokeCard.style.transform = 'translateY(6px)';
  setTimeout(()=>{
    jokeCard.style.opacity = '1';
    jokeCard.style.transform = 'translateY(0)';
  }, 200);
}

// Fetch random joke
async function fetchJoke(){
  const url = 'https://official-joke-api.appspot.com/random_joke';
  const controller = new AbortController();
  const timeout = setTimeout(()=> controller.abort(), 3500);

  try {
    setLoading(true);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if(!res.ok) throw new Error('Bad response');
    const data = await res.json();
    return { setup: data.setup || '', punchline: data.punchline || '' };
  } catch (err) {
    const f = fallback[Math.floor(Math.random()*fallback.length)];
    return { setup: f.setup, punchline: f.punchline + ' (fallback)' };
  } finally {
    setLoading(false);
  }
}


function renderJoke(joke){
  setupEl.textContent = joke.setup;
  punchEl.textContent = joke.punchline;
  animateJoke();
}


async function newJoke(){
  const joke = await fetchJoke();
  renderJoke(joke);
}


function tweetCurrent(){
  const text = `${setupEl.textContent} — ${punchEl.textContent}`;
  const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}


newBtn.addEventListener('click', newJoke);
tweetBtn.addEventListener('click', tweetCurrent);


window.addEventListener('DOMContentLoaded', newJoke);
