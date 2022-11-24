
const Calculator = (input,output,btns,clear,num,operators,backspace) =>{
  let equationStack = [];

  const clearAll = () =>{
      input.textContent ="0"
      output.textContent = "0"
      equationStack=[]
  }

  const deleteOnError = () =>{
    let inplen = input.textContent.length
    if(input.textContent.length === 1 && !input.textContent.startsWith('0')) return input.textContent = "0"
    if(input.textContent.length === 1 && isNaN(input.textContent)) return input.textContent = "0"
    if(input.textContent.length > 1) return input.textContent = input.textContent.substring(0,inplen-1)
  }

  const largeInput = (temp) =>{
    input.textContent = temp
    return input.textContent
  }

  const setNum = (n) =>{
    let inplen = input.textContent.length
    if(inplen < 22){
      if(inplen === 1 && isNaN(input.textContent) && !isNaN(n)) return input.textContent = n
      if ((input.textContent.charAt(0) === "0") && (inplen === 1)&&((n !== "0") && (n!==".")) )  return input.textContent = n
      if(inplen >=1 && (n !== "." && n!== "0")) return  input.textContent = input.textContent.concat(n)
      if((input.textContent.indexOf('.') === -1) &&(inplen >=1) &&(n===".")) return input.textContent = input.textContent.concat(n)
      if(/\+|\/|\-|\*/g.test(input.textContent)) return input.textContent = n
      if(n === "0" && inplen >=1) return input.textContent = input.textContent.concat(n)
    }
    else{
      let temp = input.textContent
      console.log(temp);
      input.textContent = "Too Large Number"
      setTimeout(()=> largeInput(temp),1000)
    }
  }

  const continueCalculation = () =>{
    if(equationStack[0] === "=") equationStack.pop()
    let temp = output.textContent
    if(equationStack[0]){
      equationStack.unshift(temp)
      output.textContent = equationStack[0]
    }
    else{
      equationStack.push(temp)
    }
  }

  const operate =() => {
    let prev = equationStack.shift()
    let op = equationStack.shift()
    let next = equationStack.shift()
    switch (op) {
      case "+":
          output.textContent = (Number(prev) + Number(next)).toString()
          continueCalculation()
      break;
      case "/":
         output.textContent =  (Number(prev) / Number(next)).toString()
         continueCalculation()
      break;
      case "-":
         output.textContent = (Number(prev)  - Number(next)).toString()
         continueCalculation()
      break;
      case "*":
         output.textContent = (Number(prev) * Number(next)).toString()
         continueCalculation()
      break;

    }
  }
  const setOperator =(s) =>{
    let last = equationStack.length - 1
    if(!isNaN(input.textContent)&& (equationStack.length === 0 || isNaN(equationStack[last]))) equationStack.push(input.textContent)
    equationStack.push(s)
    output.textContent = equationStack[0] ?  equationStack[0] : input.textContent
    if (s !== "=") input.textContent = s
    if(equationStack.length >=3) operate()
  }
  let prev = input.textContent ==="0" || equationStack.length ===0 ? input.textContent : output.textContent
  let next =  isNaN(input.textContent) ? prev : "0"
  return {prev,next, setNum, setOperator, clearAll,operate, deleteOnError}
}

let input = document.querySelector('.input')
let output = document.querySelector('.output')
let btns = [...document.querySelectorAll('button')]
let clear =document.querySelector('[data-clear]')
let num = btns.filter(b=> b.dataset.operand ==="operand" || b.dataset.decimal === "decimal")
let operators = btns.filter(b=> b.dataset.operator || b.dataset.equal)
let backspace = document.querySelector('[data-backspace]')
let calculator = Calculator(input,output,btns,clear,num,operators,backspace)

clear.addEventListener('click',()=>{calculator.clearAll()})

num.forEach((n) => {
  n.addEventListener('click',()=>{
    let text = n.textContent
    calculator.setNum(text)
  })
});

operators.forEach((el) => {
  el.addEventListener("click",()=>{
    let symbol = el.textContent
    calculator.setOperator(symbol)
  })
});

backspace.addEventListener("click",()=>{
  calculator.deleteOnError()
})

btns.forEach((b) => {
  b.addEventListener('keydown',(e)=>{
    e.preventDefault()
    if(!isNaN(e.key)) calculator.setNum(e.key)
    if(/\*|\/|\-|\+|\=/g.test(e.key)) calculator.setOperator(e.key);
    if(e.key === ".") calculator.setNum(e.key)
    if(e.key === "Enter") calculator.setOperator("=");
    if(e.key === "Backspace") calculator.deleteOnError();
    if(e.key === "Delete") calculator.clearAll()
  })
});
