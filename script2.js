window.onload = function() {
    fetchData();
};

async function fetchData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json');
        jsonData = await response.json();
        // ...
        jsonData=await getImageUrls(jsonData);
        let uniquejsonData=await getUniqueObjectsById(jsonData);
        localStorage.setItem('imageUrls', JSON.stringify(uniquejsonData));

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

//const accessKey = 'gtsCCrPRKXxcPPf8P0toEGHO7guntiAdgSBJuuP99J8';
//const accessKey = 'IWBzN8Iz_YI1VobBhZLBwZrsZ6A6hwhPS8Ve4wZDJC4';
const accessKey= 'OWnusYLd3oLt6remxoGpkj9sDpkWWtEZalQsgjzXZPQ';

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

