const typingForm=document.querySelector(".typing-form");
 const chatList=document.querySelector(".chat-list");
let usermessage=null;

const toggle=document.querySelector("#toggle-btn");
 const delete_btn= document.querySelector("#delete");

 const suggestion=document.querySelectorAll(".suggestion");

   let   isResponsegenerating= false;

const API_KEY=`AIzaSyC3tqb4oJH7eAI7PrGBdzKMBZ9GXeuyW-w`;

// const api_url=` "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}"`

const api_url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;


const localStoragedata=()=>{
    const savedChats = localStorage.getItem("savedChats");
      const  isLightmode= (localStorage.getItem("themeColor") === "light_mode");

      document.body.classList.toggle("light_mode",isLightmode);
      toggle.innerText = isLightmode ? "dark_mode" : "light_mode";

      chatList.innerHTML = savedChats || "";
      chatList.scrollTo(0,chatList.scrollHeight);
}

localStoragedata();


const creatMessageElement=(content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML=content;
return div;
    
}
// AIzaSyAnQ7ajcNcXTvMsGIF1m_LaJDEiSVEy-NA


const showTypingEffect = (text, textelement,incomingmessagediv) => {
    const words = text.split(' '); 
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textelement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingmessagediv.querySelector(".icon").classList.add("hide");

        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponsegenerating= false;
            incomingmessagediv.querySelector(".icon").classList.remove("hide");
             localStorage.setItem("savedChats",chatList.innerHTML);      //save chat in local storage
             chatList.scrollTo(0,chatList.scrollHeight);
        }
    }, 80);
};



 const  generateAPIresponse= async(incomingmessagediv)=>{
    const textelement= incomingmessagediv.querySelector(".text");
        try {
            const response = await fetch(api_url, {
                method: "POST" ,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: usermessage }]
                        }
                    ]
                })
            });
    
            const data = await response.json();
            const APIresponse= data. candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
       
            showTypingEffect(APIresponse, textelement, incomingmessagediv);
            
        } catch (error) {
            isResponsegenerating= false;
            console.log(error);
        }finally{
            incomingmessagediv.classList.remove("loading");
        }
    };
    
 

const  showLoadingAnimation=()=>{
    const html = `
       <div class="message-content">
                <img src="images/gemini.svg" alt="ai" class="avatar">
                <p class="text"></p>
                    <div class="loading-indicator">
                               <div class="loading-bar"></div>
                               <div class="loading-bar"></div>
                               <div class="loading-bar"></div>
                    </div>
              </div>
              <span onclick="copyMessage(this)"  class="icon material-symbols-rounded">
                content_copy
                </span>
`;
   const incomingmessagediv=   creatMessageElement(html,"incoming","loading");
   chatList.appendChild(incomingmessagediv);
   chatList.scrollTo(0 ,chatList.scrollHeight);
       generateAPIresponse(incomingmessagediv);
}

       const copyMessage = (copyIcon) =>{
            const messageText = copyIcon.parentElement.querySelector(".text").innerText;

            navigator.clipboard.writeText(messageText);
            copyIcon.innerText="done";
    setTimeout(()=> copyIcon.innerText= "content_copy",1000);
            
       }



const handelOutgoingchat= ()=>{
    usermessage=document.querySelector(".typing-input").value.trim() ||usermessage ;
    if(!usermessage || isResponsegenerating )return;
    isResponsegenerating= true;
   
    const html = `
    <div class="message-content">
        <img src="images/user.jpg" alt="user profile" class="avatar" />
        <p class="text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum eos natus eius obcaecati. 
            Libero, illum quasi magnam praesentium cupiditate dolorem ad beatae ratione voluptate amet! Vel.
        </p>
    </div>
`;
   const outgoingmessagediv=   creatMessageElement(html,"outgoing");
    
   outgoingmessagediv.querySelector(".text").innerText =usermessage;

   chatList.appendChild(outgoingmessagediv);

   typingForm.reset();
   chatList.scrollTo(0,chatList.scrollHeight);
   setTimeout(showLoadingAnimation,500);
}

toggle.addEventListener("click",
    () =>{
       const isLightmode= document.body.classList.toggle("light_mode");
       localStorage.setItem("themeColor", isLightmode ? "light_mode" : "dark_mode" );
           toggle.innerText = isLightmode ? "dark_mode" : "light_mode";
    }
);



delete_btn.addEventListener("click",() =>{
    if(confirm("Are you sure want to delete all messages?")){
            localStorage.removeItem("savedChats");
              localStoragedata();
    }
}

)

suggestion.forEach(suggestion =>{
    suggestion.addEventListener("click",()=>{
        usermessage= suggestion.querySelector(".text").innerText;
        handelOutgoingchat();
    }
       
    )
})


typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();
  
     handelOutgoingchat();
}
)

















       
