window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
});

// let Searchlocation=document.getElementById("location").value.trim();
// let Checkin=document.getElementById("check-in").value;
// let Checkout=document.getElementById("check-out").value;

let Homesearch_btn=document.getElementById("search-btn");

Homesearch_btn.addEventListener("click",()=>{
    window.location.href="Standard.html";
    // console.log(Searchlocation);
    // console.log(Checkin);
    // console.log(Checkout);
    console.log("card-clicked");
})

let card=document.getElementsByClassName("card")[0];

card.addEventListener("click",()=>{
    window.location.href="listing.html";
})