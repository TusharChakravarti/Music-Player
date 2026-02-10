
 let currentSong = new Audio();
 let songs
 let currFolder
isdraggable = false;
async function getSongs(folder) {
currFolder = folder
let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
let response =  await a.text();
let div = document.createElement('div')
div.innerHTML = response

let as = div.getElementsByTagName('a');


songs =[]
for (let i = 0; i < as.length; i++) {
    const element = as[i]; 
  
    
    if(element.href.endsWith(".mp3")){
    
        
      songs.push(element.href.split(`/${folder}/`)[1])
    }
    
}

// show all the songs in the playlist
 let songUL = document.querySelector('.songList').getElementsByTagName('ul')[0];
songUL.innerHTML = ""

for (const song of songs) {

  
    songUL.innerHTML = songUL.innerHTML+
  
    
    `
              <li>
            <img class="invert" src="/img/music.svg" alt="">
            <div class="info">
 <div class="songname">${decodeURIComponent(song)}</div>
          <div class="songartist">Harry</div>
        
            </div>
             <div class="playNow">
                <span>Play Now</span>
               <img class="invert" src="/img/play.svg" alt="no-img">

             </div></li> `
    
}

// Attach an event listner to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
  
  

e.addEventListener('click',(element)=>{

  
  

  
playMusic(element.currentTarget.querySelector(".info").firstElementChild.innerText);
  
 
  
  
})
  
})






}


 let playbtn = document.querySelector('#play')



const playMusic = (track,pause = false)=>{

  currentSong.src = `/${currFolder}/`+track.trim()
  if(!pause){ // play == false
currentSong.play()
 play.src = '/img/pause.svg'
 }
    const songname = document.querySelector('.songinfo .songname')
  songname.innerHTML = decodeURIComponent(track)
 
  document.querySelector('.songtime').innerHTML = "00:00/00:00"
  
}

function secondToMinutesSecond(seconds){
  if(isNaN(seconds)||seconds<0){
    return "00:00"
  }
  const minutes = Math.floor(seconds/60);
  const remainingSeconds = Math.floor((seconds)%60);
  const formatedminutes =String(minutes).padStart(2,'0');
  const fromatedSeconds= String(remainingSeconds).padStart(2,'0');
  return `${formatedminutes}:${fromatedSeconds}`;
}

async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/music/`)
let response =  await a.text();
let folder;
let div = document.createElement('div')
div.innerHTML = response
let anchors = div.getElementsByTagName('a')

Array.from(anchors).forEach(e=>{

  
  if(e.href.includes('/music/')){
    console.log(e.href);
    
    console.log(e.href.split('/').slice(-1)[0]);
    
  }

})



}


async function main(){
   
    
    // Get the list of  all the songs 
  await getSongs('music/ncs')
 playMusic(songs[0],true);
 
// Display the albums on the page
displayAlbum()


//Attach an event listner to play next and previous
play.addEventListener('click',()=>{
  if(currentSong.paused){
    currentSong.play()

    play.src = '/img/pause.svg'
    
  
   
    


  }
  else{
    currentSong.pause()
    play.src = '/img/play.svg'

  }
})

// Listen for time update event
currentSong.addEventListener('timeupdate',()=>{
  
  const currentTime = secondToMinutesSecond(currentSong.currentTime)
  const duration = secondToMinutesSecond(currentSong.duration)
  if(currentSong.currentTime == currentSong.duration){
    play.src = '/img/play.svg'
  }
  document.querySelector('.songtime').innerHTML = `${currentTime} / ${duration}`
let circle = document.querySelector('.circle')
let seek = (currentSong.currentTime / currentSong.duration)*100
  circle.style.left  = (seek-1)+'%';
  document.querySelector('.seekbar').style.background = `linear-gradient(to right,
 #00FEFF ${seek}%, black ${seek}%)`


})

 document.querySelector('.seekbar').addEventListener('click',(e)=>{
 
  let seeking = (e.offsetX/e.target.getBoundingClientRect().width)*100
  document.querySelector('.circle').style.left =  ((e.offsetX/e.target.getBoundingClientRect().width)*100 +"%");
   currentSong.currentTime = Number((e.offsetX/e.target.getBoundingClientRect().width)*100)/100* currentSong.duration;
   document.querySelector('.seekbar').style.background = `linear-gradient(to right,#00FEFF ${seeking}%,white ${seeking}%)`
    
    
  })


// Add an event lister for hamburger
  document.querySelector('.hamburger').addEventListener('click',(e)=>{
      document.querySelector('.left').style.left = '0%'


      
  })
  // Add an event listner for close button
  document.querySelector('.close').addEventListener('click',()=>{
    document.querySelector('.left').style.left = '-120%'
  })

// Add event listner to previous 
   document.querySelector('#previous').addEventListener('click',()=>{
    currentSong.pause();
     let curr_idx = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
   
    
 
    
  if((curr_idx-1)>=0){
   
      playMusic(songs[curr_idx-1]);

    }
     
  })
  // Add event listner to next

  document.querySelector('#next').addEventListener('click',()=>{
    currentSong.pause()
    console.log(currentSong.src);
    
    let curr_idx = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
  
       console.log(curr_idx);
    
 
    
    if(curr_idx+1<songs.length){
   
      playMusic(songs[curr_idx+1]);

    }

     
  })

  // add event listner
  document.querySelector('.range input').addEventListener('change',function(e){
        console.log("Setting Value to ",e.target.value,"/  100");
     
        
        currentSong.volume =parseInt(e.target.value)/100
        

  })

  //Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName('card')).forEach(function(e){
  
  e.addEventListener('click',async (item)=>{
    console.log(e.dataset.folder,item.target,item.currentTarget.dataset);
    
  await getSongs(`music/${item.currentTarget.dataset.folder}`);

  })


})

  



}




main();







