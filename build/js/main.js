var openMenu = document.querySelector('.menu-control');
var modalCall = document.querySelector('.modal-call');
var modalCallOpen = document.querySelector('.main-menu .btn');
var modalCallClose = document.querySelector('.modal-call__close');
// var cartOpen = document.querySelector('.btn--buy');
var cart = document.querySelector('.cart');
var cartWr = document.querySelector('.cart__wrap');
// var del = document.querySelector('.cart__item-del');
var cartOverLay = document.querySelector('.cart__overlay');
var modalSend = document.querySelector('.btn--call');

openMenu.addEventListener('click', function() {
  this.classList.toggle('menu-control--active');
});

modalCallOpen.addEventListener('click', function(){
  modalCall.classList.add('modal-call--open');
  openMenu.classList.remove('menu-control--active');
});

modalCallClose.addEventListener('click', function(){
  modalCall.classList.remove('modal-call--open');
  modalCall.classList.remove('modal-call--sent');
});

modalSend.addEventListener('click', function(e){
  modalCall.classList.add('modal-call--sent');
});

// cartOpen.addEventListener('click', function(){
//   cart.style.display="block";
// });

cartWr.addEventListener('click', function(){
  cartOverLay.classList.toggle ('cart__overlay--show');
});


var cartList = document.querySelector('.cart__list');
var products = document.querySelector('.products');
var cartTemplate = document.querySelector('template');
var cartPrice = document.querySelector('.cart__price span');
var cartQnt = document.querySelector('.cart__qnt');

/**
 * Получаем у товара нужные данные для передачи в корзину
 * @param {id товара для добавления в корзину(берем из data-buy на кнопке "заказать")} productId
 */
function getProduct(productId) {

    var product = document.getElementById(productId);
    var dataProduct = {
      id: product.id,
      name: product.dataset.name,
      price: product.dataset.price
    };

    return dataProduct;
  };

/**
 * пересчитываем сумму
 * @param {товар в корзине} item
 */
  function totalSum() {
    var cartItems = cartList.querySelectorAll('.cart__item');
    itemSum = [];
    var totalQnt = 0 ;

    for(var i = 0; i < cartItems.length; i++) {
      itemSum[i] = cartItems[i].dataset.price * cartItems[i].querySelector('.cart__item-qnt').value;
      cartItems[i].querySelector('.cart__item-sum span').innerText = itemSum[i]

      totalQnt += parseInt(cartItems[i].querySelector('.cart__item-qnt').value);
    }

    var totalCartPrice = itemSum.reduce(function(sum, current) {
      return sum + current;
    }, 0);
    cartPrice.innerText = totalCartPrice;
    if(!totalCartPrice) {
      cart.removeAttribute('style');
      cartOverLay.classList.remove ('cart__overlay--show');
    }

    cartQnt.innerText = totalQnt;

    return totalQnt;
  }

/**
 * создаем товар в корзине по шаблону
 */
 function createCartItem() {
   if ('content' in cartTemplate) {
        elementToClone = cartTemplate.content.querySelector('.cart__item');
      } else {
        elementToClone = cartTemplate.querySelector('.cart__item');
      }

      var element = elementToClone.cloneNode(true);
      element.dataset.id = product.id;
      element.dataset.price = product.price;
      element.querySelector('.cart__item-name').innerText = product.name;
      element.querySelector('.cart__item-price span').innerHTML = product.price;
      element.querySelector('.cart__item-del').addEventListener('click', function() {
        element.parentNode.removeChild(element);
        totalSum();

      });
      var itemQnt = element.querySelector('.cart__item-qnt');
      itemQnt.addEventListener('change', totalSum);

      var plusQnt = element.querySelector('.js-plus');
      var minusQnt = element.querySelector('.js-minus');

      plusQnt.addEventListener('click', function() {
        element.querySelector('.cart__item-qnt').value++;
        totalSum();
      })
      minusQnt.addEventListener('click', function() {
        if(element.querySelector('.cart__item-qnt').value > 1) {
          element.querySelector('.cart__item-qnt').value--;
          totalSum();
        } else {
          element.parentNode.removeChild(element);
          totalSum();
        }
      })

      cartList.appendChild(element);

 }

/**
 * добавляем товар в корзину, если он уже есть прибавляем количество и пересчитываем сумму
 * @param {Id товара для добавления в корзину(берем из data-buy на кнопке "заказать")} productId
 */
var addItemToCart = function(productId) {
  product = getProduct(productId);
  var cartItems = cartList.querySelectorAll('.cart__item');
  var isCreated = false;
  if(cartItems.length) {
    for(var i = 0; i < cartItems.length; i++) {
      if(cartItems[i].dataset.id == product.id) {
        isCreated = true;
        var cartCreatedItem = cartItems[i];
      }
    }
    if(!isCreated) {
      createCartItem()

    } else {
      cartCreatedItem.querySelector('.cart__item-qnt').value++;
        totalSum();

    }
  } else {
      cart.style.display="block";
      createCartItem()
  }


  totalSum();
};


/**
 * клик на кнопку "заказать"
 */
products.addEventListener('click', function(e) {
  if(e.target.classList.contains('btn--buy')){
    addItemToCart(e.target.dataset.buy);
  }
});
