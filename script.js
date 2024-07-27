let jsonData=[];


let orderData=JSON.parse(localStorage.getItem('orderData'));
if (!Array.isArray(orderData))
{
    orderData=[];
}

//to check whether the current file is index.html or order.html
window.onload = function() {
    // Check if the current page is index.html
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
        fetchData();
    }
    else if (window.location.pathname.endsWith('/order.html'))
    {
        getMenu(orderData);
    }
};

async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json');
        jsonData = await response.json();
        // ...
        jsonData=await getImageUrls(jsonData);
        let uniquejsonData=await getUniqueObjectsById(jsonData);
        localStorage.setItem('imageUrls', JSON.stringify(uniquejsonData));
        getMenu(uniquejsonData);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const accessKey = 'gtsCCrPRKXxcPPf8P0toEGHO7guntiAdgSBJuuP99J8';
//const accessKey = 'IWBzN8Iz_YI1VobBhZLBwZrsZ6A6hwhPS8Ve4wZDJC4';

async function getImageUrls(jsonData) {

    let imageUrls = JSON.parse(localStorage.getItem('imageUrls'));

    if (!Array.isArray(imageUrls))
    {
        imageUrls=[];
    }

    for (const item of jsonData) {
      try {

        let imageUrl;
  
        if (item.imgSrc.startsWith('https://unsplash.com/photos/')) 
        {
          // Handle Unsplash photo URLs
          const photoId = item.imgSrc.split('/').pop();
          const response = await fetch(`https://api.unsplash.com/photos/${photoId}?client_id=${accessKey}`);
          const data = await response.json();
  
          if (data.urls && data.urls.regular) 
            {
                console.log(data.urls.regular);
                imageUrl = data.urls.regular;
            } 
          else 
            {
               console.warn(`No image found for ${item.name} on Unsplash`);
            }
        } 
        else if (item.imgSrc.startsWith('https://source.unsplash.com/random/')) 
        {
          // Handle random Unsplash image URLs
          const query = encodeURIComponent(item.name);

          const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`);
          const data = await response.json();

           if (data.urls && data.urls.regular) 
            {
                  imageUrl = data.urls.regular;
            } 
            else 
            {
                console.warn(`No image found for ${item.name} on Unsplash`);
            }
        } 
        else 
        {
          console.warn(`Unsupported image source for ${item.name}`);
        }


        if (imageUrl) 
        {
            console.log(imageUrl)
            imageUrls.push({ id: item.id, name: item.name,price: item.price, imageUrl });
        }
      } 
      catch (error) 
      {
        console.error(`Error fetching image for ${item.name}: ${error}`);
      }
    }
  
    return imageUrls;
  }
  

  //get unique objects for my menu:-
  function getUniqueObjectsById(arr) 
  {
    let uniqueObjects = [];
    let idMap = new Map();

    for (const obj of arr) 
        {
          const { id } = obj;

          if (!idMap.has(id)) 
            {
               idMap.set(id, obj);
               uniqueObjects.push(obj);
            }
         }

  return uniqueObjects;
}


  //search funtion

async function handleSearch(event) {
    if (event.key === "Enter") {
      // Perform your search action here
      event.preventDefault(); // Prevent form submission
      await fetchData();
      console.log("Search query:", event.target.value);
      let searchData=jsonData.filter((item)=>item.name.toLowerCase().includes(event.target.value.toLowerCase()));
      menuBody.innerHTML="";
      getMenu(searchData);
    }
  }
  


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
    getMenu(jsonData);
}
 