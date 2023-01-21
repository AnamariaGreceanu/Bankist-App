'use strict';
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-04-10T14:43:26.374Z',
      '2022-09-02T18:49:59.371Z',
      '2022-09-04T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2022-06-25T18:49:59.371Z',
      '2022-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];
  
  /////////////////////////////////////////////////
  // Elements
  const labelWelcome = document.querySelector('.welcome');
  const labelDate = document.querySelector('.date');
  const labelBalance = document.querySelector('.balance__value');
  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelTimer = document.querySelector('.timer');
  
  const containerApp = document.querySelector('.app');
  const containerMovements = document.querySelector('.movements');
  
  const btnLogin = document.querySelector('.login__btn');
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const btnSort = document.querySelector('.btn--sort');
  
  const inputLoginUsername = document.querySelector('.login__input--user');
  const inputLoginPin = document.querySelector('.login__input--pin');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');
  
const fromatMovementDate = function (date,locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
  
  const daysPassed=calcDaysPassed(new Date(),date)

  if(daysPassed===0) return 'today'
  if(daysPassed===1) return 'yesterday'
  if (daysPassed <= 7) return `${daysPassed} days ago`
    // const day = `${date.getDate()}`.padStart(2, 0)//2 char long,padded with a 0
    // const month = `${date.getMonth() + 1}`.padStart(2, 0)
    // const year = date.getFullYear()
    // return `${day}/${month}/${year}`
  return new Intl.DateTimeFormat(locale).format(date)
}

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency:currency,
  }).format(value)
}

const displayMovements = function (account,sort=false) {
  containerMovements.innerHTML = ''
  //slice mi l copiaza cumva, pt ca daca faceam sortarea imd imi schimba arrayul de tot
  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(account.movementsDates[i])
    const displayDate=fromatMovementDate(date,account.locale)

    const formattedMov=formatCur(mov,account.locale,account.currency)
    //${mov.toFixed(2)} in loc de formattedmov mai jos
    const html = `
      <div class="movements">
        <div class="movements__row">
        <div class="movements__type 
        movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `
    //afterbegin pune val de jos in sus,invers era beforeend
    containerMovements.insertAdjacentHTML('afterbegin',html)
  })
}

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0)

  labelBalance.textContent=formatCur(account.balance,account.locale,account.currency)
  // labelBalance.textContent = `${account.balance.toFixed(2)} EUR`
}

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent =formatCur(incomes,account.locale,account.currency)
    //`${incomes.toFixed(2)}EUR`
  
  const out= account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent =formatCur(Math.abs(out),account.locale,account.currency)
    //`${Math.abs(out).toFixed(2)}EUR`

//la fiec income banca ii ofera 1.2 din suma
//daca e mai mare decat 1 se adauga la suma interest
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr)
      return int>=1
    })
    .reduce((acc, int) => acc + int, 0)
  labelSumInterest.textContent =formatCur(interest,account.locale,account.currency)
    //`${interest.toFixed(2)}EUR`  
}

const createUsernames = function (accs) {
  accs.forEach(function (acc) { //does work without returning anything
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])//a new simple array
      .join('')
  })
}
createUsernames(accounts);

const updateUI = function (account) {
  displayMovements(account)
  calcDisplayBalance(account)
  calcDisplaySummary(account)
}

const startLogoutTimer = function () {
  
  const tick = function () {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0)
    const sec = String(time % 60).padStart(2,0)
    
    labelTimer.textContent =`${min}:${sec}`
    
    if (time === 0)
    {
      clearInterval(timer)
      labelWelcome.textContent = 'log in to get started'
      containerApp.style.opacity=0
    }
      time--
  }
  let time = 10
  tick()
  const timer = setInterval(tick, 3000);
  return timer
}

let currentAccount,timer

//faked logged in always
// currentAccount = account1
// updateUI(currentAccount)
// containerApp.style.opacity = 100



btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault()
  currentAccount= accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100

    //day/monthly/year
    const now = new Date()
    const options = {
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month: 'long',//numeric,sau 2-digit
      year: 'numeric',//2-digit:22
      weekday:'long'
    }
    // const locale = navigator.language
    // console.log(locale)//en-US
    labelDate.textContent = new Intl
      .DateTimeFormat(currentAccount.locale,options)
      .format(now)
    
    // const now = new Date()
    // const day = `${now.getDate()}`.padStart(2,0)//2 char long,padded with a 0
    // const month = `${now.getMonth()+1}`.padStart(2,0)
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2,0)
    // const min = `${now.getMinutes()}`.padStart(2,0)
    // labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`


    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()
    if(timer) clearInterval(timer)
    timer=startLogoutTimer()
    updateUI(currentAccount)
  }
})

btnTransfer.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(
    acc=>acc.username===inputTransferTo.value
  )
  inputTransferAmount.value=inputTransferTo.value=''

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username) {
    
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)

    currentAccount.movementsDates.push(new Date().toISOString())
    receiverAcc.movementsDates.push(new Date().toISOString())

    updateUI(currentAccount)

    clearInterval(timer)
    timer=startLogoutTimer()
  }
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault()

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value)===currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc=>acc.username===currentAccount.username
    )
    console.log(index)

    accounts.splice(index, 1)
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value=inputClosePin.value=''
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  //const amount = Number(inputLoanAmount.value)
  const amount = Math.floor(inputLoanAmount.value)
  
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function()
    {
      currentAccount.movements.push(amount)
    currentAccount.movementsDates.push(new Date().toISOString())

      updateUI(currentAccount)
      
    clearInterval(timer)
      timer = startLogoutTimer()
      
    },2500)
  }
  inputLoanAmount.value=''
})

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted)
  sorted=!sorted
})

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')]
//     .forEach(function (row, i) {
//     if(i%2===0) row.style.backgroundColor='orangered'
//     if(i%3===0) row.style.backgroundColor='blue'
//   })
// })

