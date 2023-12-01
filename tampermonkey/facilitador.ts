let imprimirBotao = $("[title=\"Imprimir\"")
let imprimirCelula = imprimirBotao.parent()
let numeroDePedidoCelula = imprimirCelula.next()
let nomeEmpresaCelula = numeroDePedidoCelula.next()
let tipoPedidoCelula = nomeEmpresaCelula.next()

console.log(numeroDePedidoCelula.text())