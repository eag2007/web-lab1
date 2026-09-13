document.body.innerHTML = '<h2>First program on JavaScript</h2>';
document.body.innerHTML += 'Hello World';

const sum = 5 + 8;
console.log('Результат операции: ');
console.log(sum);

let username;
username = 'Tom';
console.log(username);

var userage = 17;
console.log(userage);

const user = 'Dmitrii';
const text = `Name: ${user}`;
console.log(`This name is ${text}`);

let email;
console.log(email);

email = null;
console.log(email);

let email_icloud = 'email@cloud';
email_icloud = undefined;
console.log(email_icloud);

const people = { name: 'Tom', age: 18 };
console.log(people);
console.log(people.name);
console.log(people.age);

const a = 1;
const b = 2;
console.log(a < b ? a : b);

console.log(null ?? 'not null');

function summa(a, b) {
  return a + b;
}

summa(1, 4);


function printPerson(username, age, email) {
  console.log(username);
  console.log(age);
  console.log(email);
}

const tom = ["Tom", 12, "fds"]

printPerson(...tom)

function l(x, y, z = 8){

  if(y === undefined) y = 5;
  if(x === undefined) x = 8;
  z = x + y;
  console.log(z);
}
l();          // 13
l(6);         // 11
l(6, 4)       // 10

function summ(){
  let result = 0;
  for(const n of arguments)
    result += n;
  console.log(result);
}
summ(6);             // 6
summ(6, 4)           // 10
summ(6, 4, 5)        // 15

function display(season, ...temps) {
  console.log(season);
  for (index in temps) {
    console.log(temps[index]);
  }
}
display('Весна', -2, -3, 4, 2, 5);
display('Лето', 20, 23, 31);

const hello_world = ()=> console.log("Hello");

const print = (mes) => console.log(mes);

