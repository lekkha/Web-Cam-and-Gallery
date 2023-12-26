//is takes some time for the page to load so set_timeout is set so that code loads only after loading 
//if code is run before the page loads it doesnt show any info in console 

setTimeout(() => {
    if (db) {
        //video retrival 
        //image retrival 
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll(); //gets all info -- is event based 
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result; //get the video information present in videoStore
            // console.log(videoResult);
            let galleryCont = document.querySelector(".gallery-cont");

            videoResult.forEach((videoObj) => {
                //1- create media element 
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                //2- copy the inner html 
                mediaElem.innerHTML = `
                <div class="media">
                   <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>`;

                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete"); 
                deleteBtn.addEventListener("click", deleteListener); 

                let downloadBtn = mediaElem.querySelector(".download"); 
                downloadBtn.addEventListener("click", downloadListener); 

                
            })
        }

        // images retrieval
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll(); //Event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
                        <div class="media">
                            <img src="${url}" />
                        </div>
                        <div class="delete action-btn">DELETE</div>
                        <div class="download action-btn">DOWNLOAD</div>
                        `;
                galleryCont.appendChild(mediaElem);

                // Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }

}, 100)

//UI remove UX remove 
function deleteListener(e){
    let id = e.target.parentElement.getAttribute("id"); 
    let type = id.slice(0,3); 
    //db remove
    if(type === "vid"){
        //tranaction -> get to store -> delete id 
        let videoDBTransaction = db.transaction("video", "readwrite"); 
        let videoStore = videoDBTransaction.objectStore("video"); 
        videoStore.delete(id); 
    }
    else if(type === "img"){
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    }

    //UI remove
    e.target.parentElement.remove();  //container removed 
}

function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id"); 
    let type = id.slice(0,3); 

    if(type === "vid"){
        let videoDBTransaction = db.transaction("video", "readwrite"); 
        let videoStore = videoDBTransaction.objectStore("video"); 
        let videoRequest = videoStore.get(id); 
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result; 
            // console.log(videoResult);
            let videoURL = URL.createObjectURL(videoResult.blobData); 

            let a = document.createElement("a");
            a.href = videoURL; 
            a.download = "stream.mp4"; 
            a.click();  
        }

    }
    else if(type === "img"){
        let imageDBTransaction = db.transaction("image", "readwrite"); 
        let imageStore = imageDBTransaction.objectStore("image"); 
        let imageRequest = imageStore.get(id); 

        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result; 
            
            let a = document.createElement("a"); 
            a.href = imageResult.url;
            a.download = "image.jpg"; 
            a.click();  

        }


    }
}