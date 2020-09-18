const { Observable, of, fromEvent, from, interval, range,
       timer, throwError, Subject} = rxjs;
const { pipe, map, filter, distinctUntilChanged, tap,
        debounceTime, throttleTime } = rxjs.operators;

const boton = document.querySelector("#boton");

/* **************************************************** 
 *                    OPERADORES
 * ****************************************************
 * 1.- Creación:
 *     + create -> constructor (difícil de utilizar) utiliza
 *         next(), error() y complete().
 *     + of   -> Emite los valores especificados como argumentos 
 *               y complete.
 *     + from EventPattern -> Crea un observable a partir de las
 *         funciones addHandler y removeHandler -> No este doc.
 *     + fromEvent -> Crea un observable que emite eventos de 
 *         un tipo específico.
 *     + from -> Crea un observable a partir de una matriz, un objeto
 *         similar a una matriz, una promesa, un objeto iterable o
 *         un objeto similar a un observable. 
 *     + Interval -> crea un Observable que emite números secuenciales 
 *        cada intervalo de tiempo especificado. Comienza con 0 y nunca termina.
 *     + Range -> crea un Observable que emite una secuencia de números dentro
 *        de un rango específico.
 *     + Timer -> crea un observable que empieza a emitir en un tiempo inicial,
 *        pasando a emitir a partir desde ese momento con un tiempo indicado.
 *     + throwError -> Lanzar un error y no hacer nada.
 * 
 * 2.- Algunos de los operadores para manejo de observables:
 *     + pipe -> encadena uno o varios operadores para manejar observables.
 *     + map -> transforma cada valor de un observable antes de devolverlo.
 *     + filter -> Deja pasar al siguiente operador o no un valor en función
 *         de una expresión (si es cierta le deja pasar).
 *     + distinctUntilChanged -> Devuelve el elemento si es distinto del anterior.
 *     + tap (para debugging) -> Para poder ver que tenemos en cada paso (como 
 *        si fuera un display de Cobol). 
 *     + debounceTime => Solo emite un elemento de un Observable si ha pasado un
 *        período de tiempo en particular sin que emita otro elemento.
 *     + throttleTime => Emite un valor desde el Observable de origen, luego ignora
 *        los valores de origen subsiguientes durante un período determinado por 
 *        otro Observable, luego repite este proceso.
 *
* ****************************************************/
/*
//1a. create => constructor de creación de un observable.
const hola = Observable.create(function(observador) {
   observador.next('Hello');
   observador.next('World');
   observador.complete();
});

hola.subscribe(val => console.log(val));

//1b. of => emite una serie de valores.
var numeros = of(10, 20, 30);  

numeros.subscribe(
   num => {console.log(num);},   
   err => {console.log(err);}, 
   () =>  {console.log('finalizado');  
});

//1c. fromEvent => emite una serie de eventos
var clicks = fromEvent(boton, 'click');  
clicks.subscribe(ev => console.log(ev));

//1d. from => Crea un observable a partir de una matriz, 
//    un objeto similar a una matriz, una promesa, un objeto 
//    iterable o un objeto similar a un observable.

var result = from([10,20,30]);  
result.subscribe(x => console.log(x), e => console.error(e));

//1e. Interval => crea un Observable que emite números secuenciales 
//     cada intervalo de tiempo especificado. Comienza con 0 y nunca termina.
var numeros = interval(1000);
numeros.subscribe(x => console.log(x));

//1f. Range -> crea un Observable que emite una secuencia de números dentro
//      de un rango específico (comienzo y longitud de la secuencia).
var numeros = range(2, 10);  
numeros.subscribe(x => console.log(x));

//1g. Timer -> Cuenta de 0 a n, esperando x milisegundo y emitiendo cada y milisegundos
var numeros = timer(3000, 1000);  
numeros.subscribe(x => console.log(x));

//1h. throwError -> lanza un error y no hace nada (ni el complete)

var result = throwError(new Error('Falló!'));

result.subscribe(  
   //Sería la función next
   x => {  
     console.log(x);  
   },  
   //Sería la función error
   err => {  
     console.log(`Hubo un error: ${err}`); 
   },  
   //Sería la función complete
   () => {  
     console.log('Completado');  
   }  
 );
*/

/* **************************************************** 
 *     COMPARTIR UN MISMO FLUJO DE OBSERVABLE
 * ****************************************************
 
 - Subject: Es un tipo especial de observable que permite que los valores
   se transmitan a varios observadores . Mientras que los Observables simples son unicast
   (cada Observador suscrito posee una ejecución independiente del Observable), 
   los Sujetos son multicast (todos reciben la misma información en tiempo real).

   Son un híbrido especial que puede actuar como Observable y Observer al mismo tiempo.

const subject = new Subject();

// Subject actua como observer
subject.subscribe({  
   next: v => console.log("observer A: " + v)  
 });  

subject.subscribe({  
   next: v => console.log("observer B: " + v)  
});

// Subject actua como observable
subject.next(1);  // observerA: 1 observerB: 1  
subject.next(2);  // observerA: 2 observerB: 2

*/

/* *************************************************** 
      OPERADORES PARA MANEJAR OBSERVABLES YA CREADOS
      (necesitamos antes pasarlo por el operador pipe)

    + pipe -> Permite encadenar uno o varios operadores
        de manejo de observables.
    + map -> Transforma cada dato recibido en otro valor.
 * **************************************************

// 2a.- Operador map => transforma valores 
const obs = from(["Manzanas","Peras","Melón"]);  

obs.pipe(
  map(value => {
      switch (value) {
        case "Manzanas":
          return "Puré";
          break;
        case "Peras":
          return "Filete";  
        case "Melón":
          return "Flan";
          break;
      }
  })
).subscribe(result => console.log(result));

// 2b.- filter => filtra elementos de un observable
const obs = of(1,2,3,4,5,6,7,8,9,10);  

const pares = obs.pipe(
  filter(num => num % 2 == 0)
);  

pares.subscribe(num => console.log(num));

// 2c.- distinctUntilChanged - Devuelve el elemento sólo si es distinto del anterior
of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4).pipe(  
    distinctUntilChanged(),  
)
  .subscribe(x => console.log(x)); // 1, 2, 1, 2, 3, 4

//2d.- tap - Para poder ver que tenemos en cada paso (como un display de Cobol)
const perros = of("Buddy", "Charlie", "Cooper", "Rocky");  

perros.pipe(  
  tap(perro => console.log("*** Perro Tap: "+perro+" ***")),  
  filter(perro => perro === "Cooper")    
).subscribe(perro => console.log("Perro: "+perro));
*/
//2e.- debounceTime - Sólo emite un elemento de un Observable si ha pasado un período de
//   tiempo en particular sin que emita otro elemento.

const input = document.querySelector("input");  
const observable = fromEvent(input, "keyup");

//observable.pipe(
//  debounceTime(3000)
//).subscribe(event => console.log(event));

//2f.- throottleTime - Emite un valor desde el Observable de origen, luego ignora
//        los valores de origen subsiguientes durante un período determinado por 
//        otro Observable, luego repite este proceso

observable.pipe(
  throttleTime(1000)
).subscribe(event => console.log(event));