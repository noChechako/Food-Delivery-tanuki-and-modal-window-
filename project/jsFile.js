let basket = document.querySelector('.basket');
let modDiv = document.querySelector('.modal');
let allDiv = document.querySelector('.allItems');
let cross = document.querySelector('.cross');
let buttons = document.querySelectorAll('.button-primary');
let modalInfo = document.querySelector('.elements__basket');
let totalPrice = document.querySelector('.total__price');

// let totalPrice = 0;
let fl = false;
let div;
let rightDiv;
let minusDiv;
let countDiv;
let plusDiv;

let food = {
    "Ролл угорь стандарт": 250,
    "Калифорния лосось стандарт": 395,
    "Окинава стандарт": 250,
    "Цезарь маки хl": 250,
    "Ясай маки стандарт 185 г": 250,
    "Ролл с креветкой стандарт": 250
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = addToBasket;
}

basket.addEventListener('click', modalOpen);
cross.addEventListener('click', modalClose)

function modalOpen() {
    event.preventDefault();
    modalContent();
    modDiv.style.display = 'block';
}

function modalClose() {

    modDiv.style.display = 'none';
}
// localStorage.clear();
function addToBasket(event) {
    // totalPrice += parseInt(this.nextElementSibling.innerHTML);
    for (let i = 0; i < localStorage.length; i++) {
        if (!fl && localStorage.key(i) == this.getAttribute('id')) {
            localStorage[this.getAttribute('id')]++;
            fl = true;
        }
    }
    if (!fl) {
        localStorage.setItem(this.getAttribute('id'), 1);
    }
    fl = false;
}



function modalContent() {

    modalInfo.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) != 0) {
            div = document.createElement('div');
            div.classList.add("elem__basket")

            nameDiv = document.createElement('div');
            nameDiv.classList.add('elem__name');
            nameDiv.innerHTML = localStorage.key(i);
            div.appendChild(nameDiv)

            rightDiv = document.createElement('div');
            rightDiv.classList.add('elem__count');

            priceDiv = document.createElement('div');
            priceDiv.classList.add('elem__price');
            priceDiv.innerHTML = food[localStorage.key(i)] *
                localStorage[localStorage.key(i)] + '₽';
            rightDiv.appendChild(priceDiv);
            minusDiv = document.createElement('div');
            minusDiv.classList.add('elem__minus');
            minusDiv.onclick = minusFunc;
            rightDiv.appendChild(minusDiv);

            countDiv = document.createElement('div');
            countDiv.innerHTML = localStorage.getItem(localStorage.key(i));
            rightDiv.appendChild(countDiv);

            plusDiv = document.createElement('div');
            plusDiv.classList.add('elem__plus');
            plusDiv.onclick = plusFunc;
            rightDiv.appendChild(plusDiv)

            div.appendChild(rightDiv);
            modalInfo.appendChild(div);

        }
    }
    priceFunc();

}

function plusFunc(event) {
    this.previousElementSibling.innerHTML++;
    localStorage[this.closest('.elem__count').previousElementSibling.innerHTML]++;
    this.closest('.elem__count').children[0].innerHTML
        = food[this.closest('.elem__count').previousElementSibling.innerHTML]
        * localStorage[this.closest('.elem__count').previousElementSibling.innerHTML] + '  &#8381;';

  
    priceFunc();
}

function minusFunc(event) {
    if (this.nextElementSibling.innerHTML != 0) {
        this.nextElementSibling.innerHTML--;
        localStorage[this.closest('.elem__count').previousElementSibling.innerHTML]--;
        // console.log(document.getElementById(this.closest('.elem__count').previousElementSibling.innerHTML).dataset.price)
        this.closest('.elem__count').children[0].innerHTML
            = food[this.closest('.elem__count').previousElementSibling.innerHTML]
            * localStorage[this.closest('.elem__count').previousElementSibling.innerHTML] + '  &#8381;';
        priceFunc()

    }
    // if(this.nextElementSibling.innerHTML==0){
    //     delete localStorage[this.closest('.elem__count').previousElementSibling.innerHTML];
    //     priceFunc();
    // }
}
function priceFunc() {
    totalPrice.innerHTML = '';
    let allPrice = document.querySelectorAll('.elem__price');
    for (let i = 0; i < allPrice.length; i++) {
        totalPrice.innerHTML =(+totalPrice.innerHTML)+ (+parseInt(allPrice[i].innerHTML));
        console.log(parseInt(allPrice[i].innerHTML))
    }
    totalPrice.innerHTML += ' &#8381;';

}

const sendForm = () => {
    const errorMessage = 'Что-то пошло не так',
        loadMessage = 'Загрузка...',
        succesMessage = 'Спасибо! Мы скоро с вами свяжемся!';

    const form = document.querySelector('.form'),
        statusMessage = document.createElement('div');
    
    statusMessage.style.cssText = 'font-size: 2rem; color: black;';

    const validate = () => {
        let formName = document.querySelector('.form-name'),
            formMail = document.querySelector ('.form-email'),
            formPhone = document.querySelector('.form-phone');
        
        formName.addEventListener('input', () => {
            formName.value = formName.value.replace(/\w/gi, '');
        });
        formMail.addEventListener('input', () => {
            formMail.value = formMail.value.replace(/\w/gi, '');
        });
        formPhone.addEventListener('input', () => {
            formPhone.value = formPhone.value.replace(/\D/g,'');
        });
    };
    // validate();
     
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        form.appendChild(statusMessage);
        statusMessage.textContent  = loadMessage;

        const formData = new FormData(form);

        let body = {};

        formData.forEach((val, key) => {
            body[key] = val;
        });
        postData(body)
            .then((response) => {
                if(response.status === 405){
                    throw new Error('status network not 200');
                }
                statusMessage.textContent = succesMessage;
            })
            .catch((error) => {
                statusMessage.textContent = errorMessage;
                console.log(error);
            });
    });

    const postData = (body) => {
        return fetch('./server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });
    }


};
sendForm();