/*
    The API path depends on which client site the user is 
    using. If it is local host then the API endpoint is
    localhost:5000
*/

function getApiPath() {
    
    let targetUrl = 'https://api.lodestarhealthdata.com/api';
    
    // handling production vs development in a simple way    
    // if (window.location.href === "http://localhost:3000/") {
    //     targetUrl = "http://localhost:5000/api";
    // } 

    return targetUrl;
      
}

export default getApiPath;