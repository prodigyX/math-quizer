export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';
export type Year = 3 | 4;
export type Question = { a: number; b: number; answer: number; operation: Operation };
export const operations = {add:{label:'Addition',symbol:'+',verb:'add'},subtract:{label:'Subtraction',symbol:'−',verb:'subtract'},multiply:{label:'Multiplication',symbol:'×',verb:'multiply'},divide:{label:'Division',symbol:'÷',verb:'divide'}};
const random = (min:number,max:number) => Math.floor(Math.random()*(max-min+1))+min;
export function makeQuestion(operation:Operation,year:Year, previous?:Question):Question {
  for(let attempt=0;;attempt++) {
    let a:number,b:number,answer:number;
    if(operation==='multiply'||operation==='divide') {const x=random(2,year===3?10:12),y=random(1,year===3?10:12);a=operation==='divide'?x*y:x;b=y;answer=operation==='divide'?x:x*y;}
    else {a=random(10,year===3?99:999);b=random(1,year===3?99:999);if(operation==='subtract'&&b>a)[a,b]=[b,a];answer=operation==='add'?a+b:a-b;}
    if(attempt>10||!previous||a!==previous.a||b!==previous.b||operation!==previous.operation)return {a,b,answer,operation};
  }
}
export function makeChoices(answer:number):number[] {const choices=new Set([answer]);while(choices.size<4){const n=answer+random(-Math.max(5,Math.ceil(answer*.15)),Math.max(5,Math.ceil(answer*.15)));if(n>=0)choices.add(n);}const shuffled=[...choices];for(let i=shuffled.length-1;i>0;i--){const j=random(0,i);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled;}
