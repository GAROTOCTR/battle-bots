
let modalKey = 0

let quantrobs = 1

let cart = [] 

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.robWindowArea').style.opacity = 0 
    seleciona('.robWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.robWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.robWindowArea').style.opacity = 0 
    setTimeout(() => seleciona('.robWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.robInfo--cancelButton, .robInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasrobs = (robItem, item, index) => {
	robItem.setAttribute('data-key', index)
    robItem.querySelector('.rob-item--img img').src = item.img
    robItem.querySelector('.rob-item--price').innerHTML = formatoReal(item.price[2])
    robItem.querySelector('.rob-item--name').innerHTML = item.name
    robItem.querySelector('.rob-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.robBig img').src = item.img
    seleciona('.robInfo h1').innerHTML = item.name
    seleciona('.robInfo--desc').innerHTML = item.description
    seleciona('.robInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    let key = e.target.closest('.rob-item').getAttribute('data-key')
    console.log('rob clicada ' + key)
    console.log(robJson[key])

    quantrobs = 1

    modalKey = key

    return key
}


const mudarQuantidade = () => {
    seleciona('.robInfo--qtmais').addEventListener('click', () => {
        quantrobs++
        seleciona('.robInfo--qt').innerHTML = quantrobs
    })

    seleciona('.robInfo--qtmenos').addEventListener('click', () => {
        if(quantrobs > 1) {
            quantrobs--
            seleciona('.robInfo--qt').innerHTML = quantrobs	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.robInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("rob " + modalKey)
    	console.log("Quant. " + quantrobs)
        let price = seleciona('.robInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
	    let identificador = robJson[modalKey].id

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            cart[key].qt += quantrobs
        } else {
            let rob = {
                identificador,
                id: robJson[modalKey].id,
                qt: quantrobs,
                price: parseFloat(price) 
            }
            cart.push(rob)
            console.log(rob)
            console.log('Sub total R$ ' + (rob.qt * rob.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' 
    }

    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' 
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
	seleciona('.menu-openner span').innerHTML = cart.length
	
	if(cart.length > 0) {

		seleciona('aside').classList.add('show')

		seleciona('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total    = 0

		for(let i in cart) {
			let robItem = robJson.find( (item) => item.id == cart[i].id )
			console.log(robItem)

        	subtotal += cart[i].price * cart[i].qt

			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let robName = `${robItem.name}`

			cartItem.querySelector('img').src = robItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = robName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				cart[i].qt++
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					cart[i].qt--
				} else {
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} 
		desconto = subtotal * 0
		total = subtotal - desconto

		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {

		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

robJson.map((item, index ) => {

    let robItem = document.querySelector('.models .rob-item').cloneNode(true)

    seleciona('.rob-area').append(robItem)

    preencheDadosDasrobs(robItem, item, index)
    
    robItem.querySelector('.rob-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na rob')

        let chave = pegarKey(e)

        abrirModal()

        preencheDadosModal(item)

		seleciona('.robInfo--qt').innerHTML = quantrobs


    })

    botoesFechar()

}) 
mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
