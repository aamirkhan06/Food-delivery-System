let imageUrls, orderData;

window.addEventListener('load', function() {
  imageUrls = JSON.parse(localStorage.getItem('imageUrls'));
  orderData = JSON.parse(localStorage.getItem('orderData'));

  if (!Array.isArray(orderData)) {
    orderData = [];
  }

  if (!Array.isArray(imageUrls)) {
    console.log("empty imageUrls");
    imageUrls = [];
  }

  // Check if the current page is index.html
  if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
    getMenu(imageUrls);
  } else if (window.location.pathname.endsWith('/order.html')) {
    getMenu(orderData);
  }
});



//const accessKey = 'gtsCCrPRKXxcPPf8P0toEGHO7guntiAdgSBJuuP99J8';
//const accessKey = 'IWBzN8Iz_YI1VobBhZLBwZrsZ6A6hwhPS8Ve4wZDJC4';
//const accessKey= 'OWnusYLd3oLt6remxoGpkj9sDpkWWtEZalQsgjzXZPQ';


  //search funtion
  


//add elements and show menu:-

let menuBody=document.querySelector("#menu-body");
let countOrder=0;

async function getMenu(data)
{
    
    data.forEach(element => {
        let menuDiv = document.createElement("div");
        menuDiv.classList.add("menu-item");

        let img = document.createElement("img");
        img.classList.add("menu-item-img");
        img.src = element.imageUrl;
        img.alt = "menu-item";

        let itemDetailsDiv = document.createElement("div");
        itemDetailsDiv.classList.add("item-details");

        let itemNamePrice = document.createElement("div");
        let itemName = document.createElement("p");
        itemName.classList.add("m-0");
        itemName.textContent = element.name;

        let itemPrice = document.createElement("p");
        itemPrice.classList.add("m-0");
        itemPrice.textContent = `$${element.price}/-`;

        let plusButton = document.createElement("i");
        plusButton.classList.add("fa-sharp", "fa-solid", "fa-square-plus", "symbol-plus");

        itemNamePrice.append(itemName);
        itemNamePrice.append(itemPrice);

        itemDetailsDiv.append(itemNamePrice);
        itemDetailsDiv.append(plusButton);

        menuDiv.append(img);
        menuDiv.append(itemDetailsDiv);

        menuBody.appendChild(menuDiv);


        //handle order
         // Add event listener to the menu item
        plusButton.addEventListener("click", async () => 
            {
            orderData.push(element);
            countOrder++;

            //if we select the three orders
            if(countOrder==3)
            {
                try
                {
                   await takeOrder(orderData); //after 2500ms
                   console.log("Order:", orderData);

                   const orderStatus = await orderPrep();
                   console.log('Order Status:', orderStatus);

                   const paymentStatus = await payOrder();
                   console.log('Payment Status:', paymentStatus);


                   if (paymentStatus.paid) 
                    {
                        await thankyouFnc();
                        localStorage.setItem('orderData', JSON.stringify(orderData));
                    }
               }
               catch(error) 
               {
                   console.log('Error handling order:', error);
               }

               //reinitialize the count order for next set of orders
               countOrder=0;
               
            }
            
        });
    });
}



//serach function:-
async function handleSearch(event) {
    if (event.key === "Enter") {
      // Perform your search action here
      event.preventDefault(); // Prevent form submission
      await fetchData();
      console.log("Search query:", event.target.value);
      let searchData=imageUrls.filter((item)=>item.name.toLowerCase().includes(event.target.value.toLowerCase()));
      menuBody.innerHTML="";
      getMenu(searchData);
    }
  }

//take order:-


function takeOrder(orderData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(orderData);
        }, 2500);
    });
}

//order preparation:-

function orderPrep() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ order_status: true, paid: false });
        }, 1500);
    });
}

//pay order:-
function payOrder() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ order_status: true, paid: true });
        }, 1000);
    });
}

//on successfull operation
function thankyouFnc() {
    window.alert('Thank you for eating with us today!');
}



//on clicking order
function orderShow()
{
    menuBody.innerHTML="";
    getMenu(orderData);
}

//on clicking menu
function menuShow()
{
    menuBody.innerHTML="";
    getMenu(imageUrls);
}
 