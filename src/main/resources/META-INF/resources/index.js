let paraSortear, participantes, sorteioId, sorteado;

let saidaSorteio, btnSorteio, animacaoSorteio, btnConfirmarSorteado, somSorteio, fimSorteio;

function buscarParticipantes() {
	const http = new XMLHttpRequest();
	http.onreadystatechange = () => trataResposta(http, atualizaParticipantes);
	http.open("GET", "/participantes", true);
	http.send(null);
	resetSorteado();
}

function limpaECarrega() {
	if (! confirm("Deseja mesmo apagar os dados e carregar do serviço de origem?")) {
		return;
	}
	const http = new XMLHttpRequest();
	http.onreadystatechange = () => trataResposta(http, atualizaParticipantes);
	http.open("POST", "/participantes/carrega", true);
	http.send(null);
}
		
function atualizaParticipantes(participantesStr) {
	participantes = JSON.parse(participantesStr);
	document.querySelector("#totalParticipantes").innerHTML = participantes.length;
	paraSortear = participantes.filter(p => p.dataSorteio == null);
	document.querySelector("#totalSorteados").innerHTML = paraSortear.length;
	
	if (paraSortear.length === 0) {
		btnSorteio.disabled = "disabled";
	} else {
		btnSorteio.disabled = "";
	}
}

function carregaNovos() {
	const http = new XMLHttpRequest();
	http.onreadystatechange = () => trataResposta(http, atualizaParticipantes);
	http.open("POST", "/participantes/atualiza", true);
	http.send(null);
	
}

function iniciaSorteio() {
	if (! sorteioId) {
		somSorteio.currentTime = 0;
		somSorteio.play();
		clearInterval(animacaoSorteio);
		saidaSorteio.style.opacity = 1.0;
		btnSorteio.innerHTML = "PARAR!";
		sorteioId = setInterval(sorteia, 100);
		clearInterval(animacaoSorteio);
		btnConfirmarSorteado.disabled = "disabled";

	} else {
		fimSorteio.currentTime = 0;
		fimSorteio.play();
		somSorteio.pause();
		btnSorteio.innerHTML = "SORTEAR!";
		clearInterval(sorteioId);
		btnConfirmarSorteado.disabled = "";
		sorteioId = null;
		animacaoSorteio = setInterval(() => {
			let opacity = parseFloat(saidaSorteio.style.opacity)
			if (opacity === 1.0) {
				opacity = 0;
			}
			saidaSorteio.style.opacity = opacity + 0.2;
		}, 100);
	}
}

function sorteia() {
	const num = Math.floor(Math.random() * paraSortear.length);
	sorteado = paraSortear[num];
	saidaSorteio.innerHTML = sorteado.nome;
}

function erro() {
	document.body.innerHTML = "<h1> ERRO! </h1>";
}

function confirmaSorteado() {
	if (! confirm("Deseja mesmo confirmar o seguinte participante como sorteado?\n" + sorteado.nome)) {
		return;
	}
	const http = new XMLHttpRequest();
	http.onreadystatechange = () => trataResposta(http, atualizaParticipantes);
	http.open("POST", "/participantes/" + sorteado.id + "/sorteia", true);
	http.send(null);
	resetSorteado();
}

function resetSorteado() {
	btnConfirmarSorteado.disabled = "disabled";
	sorteado = null;
}

function trataResposta(http, callback) {
	if (http.readyState === http.DONE) {
		if (http.status === 200) {
			callback(http.responseText);
		} else {
			erro();
		}
	}
}


window.onload = function() {
	btnSorteio = document.querySelector("#btnSorteio");
	saidaSorteio = document.querySelector("#saidaSorteio");
	somSorteio = document.querySelector("#somSorteio");
	fimSorteio = document.querySelector("#fimSorteio");
	btnConfirmarSorteado = document.querySelector("#btnConfirmarSorteado");
	buscarParticipantes();
}













