let malla = {};
let creditosAprobados = 0;
let aprobados = {};

function cargarMalla() {
  fetch('malla.json')
    .then(response => response.json())
    .then(data => {
      malla = data;
      inicializarAprobados();
      mostrarMalla();
    });
}

function inicializarAprobados() {
  malla.semestres.forEach(sem => {
    sem.ramos.forEach(ramo => {
      aprobados[ramo.codigo] = false;
    });
  });
}

function mostrarMalla() {
  const contenedor = document.getElementById('malla');
  contenedor.innerHTML = '';
  creditosAprobados = 0;

  malla.semestres.forEach((sem, idx) => {
    const divSem = document.createElement('div');
    divSem.className = 'semestre';
    divSem.innerHTML = `<h3>${sem.nombre}</h3>`;

    sem.ramos.forEach(ramo => {
      const divRamo = document.createElement('div');
      divRamo.className = 'ramo';
      divRamo.textContent = `${ramo.nombre} (${ramo.creditos} cr.)`;
      
      if (!puedeDesbloquearse(ramo)) {
        divRamo.classList.add('bloqueado');
      }

      divRamo.onclick = () => {
        if (!puedeDesbloquearse(ramo)) return;
        if (aprobados[ramo.codigo]) {
          divRamo.classList.remove('aprobado');
          aprobados[ramo.codigo] = false;
          creditosAprobados -= parseFloat(ramo.creditos);
        } else {
          divRamo.classList.add('aprobado');
          aprobados[ramo.codigo] = true;
          creditosAprobados += parseFloat(ramo.creditos);
        }
        mostrarMalla();
        actualizarCreditos();
      };

      if (aprobados[ramo.codigo]) {
        divRamo.classList.add('aprobado');
      }

      divSem.appendChild(divRamo);
    });

    contenedor.appendChild(divSem);
  });

  actualizarCreditos();
}

function puedeDesbloquearse(ramo) {
  if (!ramo.prerrequisitos || ramo.prerrequisitos.length === 0) return true;
  return ramo.prerrequisitos.every(req => aprobados[req]);
}

function actualizarCreditos() {
  document.getElementById('creditos').textContent = `Créditos aprobados: ${creditosAprobados}`;
}

window.onload = cargarMalla;
