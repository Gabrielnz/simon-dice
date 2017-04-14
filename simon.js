const niveles = 15

let teclas = generarTeclas(niveles)

function siguienteNivel(nivelActual) {
  // si supera todos los niveles
  if(nivelActual == niveles) {
    return swal({
      title: 'Ganaste!',
      type: 'success'
    })
  }

  setTimeout(() => swal({
    title: `Nivel ${nivelActual + 1}`,
    showConfirmButton: false,
    timer: 1300
  }), 500)

  // establece un tiempo para que se activen las teclas que tocan
  // dependiendo del nivel actual
  for(let i = 0; i <= nivelActual; i++) {
    setTimeout(() => activate(teclas[i]), 1000 * (i + 1) + 1500)
  }

  let i = 0
  let teclaActual = teclas[i]
  // agrega el manejo del evento de presionar tecla
  window.addEventListener('keydown', onkeydown)

  function onkeydown(ev) {
    // si la tecla presionada es la tecla que toca presionar, la activa con success
    if (ev.keyCode == teclaActual) {
      activate(ev.keyCode, { success: true })
      i++

      // si ya termino la ronda, quita el evento agregado anteriormente
      if(i > nivelActual) {
        window.removeEventListener('keydown', onkeydown)
        setTimeout(() => siguienteNivel(i), 1500)
      }
      // ahora toca la siguiente tecla
      teclaActual = teclas[i]
    } else {
      activate(ev.keyCode, { fail: true })
      window.removeEventListener('keydown', onkeydown)
      setTimeout(() => swal({
        title: 'Perdiste :(',
        text: 'Quieres jugar de nuevo?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        closeOnConfirm: true
      }, function (ok) {
        // si pierdes y quieres volver a jugar, vuelve a generar las teclas y reinicia el nivel
        if(ok) {
          teclas = generarTeclas(niveles)
          siguienteNivel(0)
        }
      }), 1000)
    }
  }
}

siguienteNivel(0)

function generarTeclas(niveles) {
  // Retorna un Array con la cantidad de posiciones igual a la cantidad
  // de niveles, llena las posiciones de 0 y luego mapea cada posiciones
  // para asignarle una tecla aleatoria
  return new Array(niveles).fill(0).map(generarTeclaAleatoria)
}

function generarTeclaAleatoria() {
  // genera teclas de forma aleatoria, entre los codigos 65 y 90
  const min = 65
  const max = 90
  return Math.round(Math.random() * (max - min) + min)
}

function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`)
}

function activate(keyCode, opts = {}) {
  const element = getElementByKeyCode(keyCode)

  element.classList.add('active')

  if (opts.success) {
    element.classList.add('success')
  } else if(opts.fail) {
    element.classList.add('fail')
  }

  setTimeout(() => deactivate(element), 500)
}

function deactivate(element) {
  element.className = 'key'
}
