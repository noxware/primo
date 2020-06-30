function setTimeoutModerno(segundos) {
  return new Promise((resolve, reject) => {
    setTimeout(()=>resolve('parametro'), segundos * 1000);
  });
}

async function hacerAlgoSinDetenerse() {
  console.log('Voy a hacer algo luego de esperar 5 segundos.');
  console.log(await setTimeoutModerno(5));
  console.log('Hice algo');
}

hacerAlgoSinDetenerse();
console.log('Otra cosa.');