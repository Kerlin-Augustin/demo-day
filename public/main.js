
document.querySelector('.deposit-btn').addEventListener('click', sendMoney)




function sendMoney(){
  let sendTo = document.querySelector('.sendTo').value
  let sendAmount = document.querySelector('.sendAmount').value
  let requestAmount = document.querySelector('.requestAmount').value
  console.log(sendAmount.length)
  if(sendAmount.length >= 1){
    console.log('theres numbers inside of this template')
    fetch('/sendMoney', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'sendTo': sendTo,
        'sendAmount': Number(sendAmount)
      })
    })
  }
  if(requestAmount.length >= 1){
    console.log('theres at least one number')
    fetch('/requestMoney', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'sendTo': sendTo,
        'requestAmount': Number(requestAmount),
        'date': new Date().toLocaleDateString()
      })
    })
  }
}

// function pay(e){
  
//   console.log(e.target)
// }
// Array.from(buttonsArray).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         console.log('testing')
        // fetch('messages', {
        //   method: 'put',
        //   headers: {'Content-Type': 'application/json'},
        //   body: JSON.stringify({
        //     'name': name,
        //     'msg': msg,
        //     'thumbUp':thumbUp
        //   })
        // })
        // .then(response => {
        //   if (response.ok) return response.json()
        // })
        // .then(data => {
        //   console.log(data)
        //   window.location.reload(true)
        // })
//       });
// });

// Array.from(thumbDown).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
//         fetch('messagesThumbsDown', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg,
//             'thumbUp':thumbUp
//           })
//         }).then(function (response) {
//           window.location.reload()
        
//         })
//       });
// });

// function myFunction() {
//   let element = document.body;
//   element.classList.toggle("dark");
//   }