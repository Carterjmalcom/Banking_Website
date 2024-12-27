let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");
let isActive =  sessionStorage.getItem("active")
main.classList.remove("main-oc-animation")
setTimeout(() => {
    main.classList.add("main-oc-animation")
}, 250);

console.log(isActive)
if(isActive=="false"){
navigation.classList.toggle("active");
main.classList.toggle("active");
console.log("test")
}

toggle.onclick = function () {
    navigation.classList.toggle("active");
    main.classList.toggle("active");  
    if (navigation.classList.contains("active")){
        sessionStorage.setItem("active", false)
        isActive =  sessionStorage.getItem("active")
        console.log(isActive) 
    } else {
        sessionStorage.setItem("active", true)
        isActive =  sessionStorage.getItem("active")
        console.log(isActive) 
    }
};




// add hovered class to selected list item
// let list = document.querySelectorAll(".navigation li");

// function activeLink() {
//   list.forEach((item) => {
//     item.classList.remove("hovered");
//   });
//   this.classList.add("hovered");
// }

// list.forEach((item) => item.addEventListener("mouseover", activeLink));