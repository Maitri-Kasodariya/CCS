let star= document.querySelectorAll('input');
let showValue1 = document.querySelector('#rating-val1');

for (let i = 0; i <5; i++) {
	star[i].addEventListener('click', function() {
		i = this.value;
           
        showValue1.innerHTML = "("+i+")";
	});
}
let showValue = document.querySelector('#rating-val2');
for (let i = 5; i <10; i++) {
	star[i].addEventListener('click', function() {
		i = this.value;
        //console.log(i);
        showValue.innerHTML = "("+i+")";
	});
}
let showValue2 = document.querySelector('#rating-val3');
for (let i = 10; i <16; i++) {
    var element = document.getElementById('star'+(i));
	element.addEventListener('click', function() {
		i = this.value;
        //console.log(i);
		showValue2.innerHTML = "("+i+")";
	});
}
function answer()
{
  alert("Your Review is submitted succesfully.");
}







