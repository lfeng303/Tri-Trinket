

function search() {
    let input = document.getElementsByClassName('search-textbox').value
    input=input.toLowerCase();
    let x = document.getElementsByClassName('product-section');
      
    for (i = 0; i < x.length; i++) { 
        let y = x[i].getElementsByClassName("product-name");
        if (y.innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="block";                 
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    document.getElementsByClassName("search-button").addEventListener("click", search);

    

    


    
});


