'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

// ₹
const account1 = {
  owner: 'Sanchit Jain',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Archie Saxena',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Diya gujral',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Samarjeet singh',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  [('RS', 'Indian currency')],
  [('USD', 'United States dollar')],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//hiding movements
containerApp.classList.add('hidden');
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//displaying movement of credit and debited
const displaymovement = function (movement) {
  containerMovements.innerHTML = ''; //removing previous
  movement.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; //deciding the type of class

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}₹</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html); //afterbegin, last one will be on top so descending order
  });
};

//displaying total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} ₹`;
};

//calculating in,out and interest
const calcDisplaySummary = function (acc) {
  const movements = acc.movements;
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}₹`;

  const spend = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = `${spend}₹`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //for interest > 1
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

// const user = 'Sanchit Jain';
//converting Sanchit Jain to sj for all the account objects
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //adding username in every object
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUserName(accounts);
// console.log(accounts);

//updating the UI

const updateUi = function (acc) {
  //display movement
  displaymovement(acc.movements);
  //display balance

  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};

//setting log in

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //page reload happens when form submit button is pressed
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // added ? because if currentAccount obj exist only we check the password else it will throw error on cosnole
    //display UI message
    labelWelcome.textContent = `Welcome Back,${
      currentAccount.owner.split(' ')[0]
    } !`;
    containerApp.classList.remove('hidden');
    //clearing input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();
    updateUi(currentAccount);
  }
});

//setting transfer button

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amt = Number(inputTransferAmount.value);
  const receiverAct = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (
    amt > 0 &&
    currentAccount.balance >= amt &&
    receiverAct && //valid reciever or not
    receiverAct?.username != currentAccount.username //not back in same acount
  ) {
    // console.log('Transfer Valid');
    currentAccount.movements.push(-amt);
    receiverAct.movements.push(amt);
    updateUi(currentAccount);
  }
});

//setting delete button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (user == currentAccount.username && pin == currentAccount.pin) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    accounts.splice(index, 1);
    containerApp.classList.add('hidden');
    labelWelcome.textContent = 'Log in to get started';
  }
});

//setting loan button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amt = Number(inputLoanAmount.value);
  if (amt > 0 && currentAccount.movements.some(move => move >= amt * 0.1)) {
    //amount added accoriding to flow chart
    currentAccount.movements.push(amt);
    updateUi(currentAccount);
  }
});
/////////////////////////////////////////////////
