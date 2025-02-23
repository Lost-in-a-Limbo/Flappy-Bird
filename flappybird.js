    let board;
    let boardWidth=360;
    let boardHeight=640;
    let context;

    let birdWidth=34;
    let birdHeight=24;
    let birdX=boardWidth/8;
    let birdY=boardHeight/2

    //Physics
    let velocityX=-2;//pipes moving left speed
    let velocityY=0;
    let gravity=0.4;

    let gameover=false;
    let score=0;


    let bird={
        x:birdX,
        y:birdY,
        height:birdHeight,
        width:birdWidth
    }

    //pipes
    let pipeArray=[];
    let pipeWidth=64;   
    let pipeHeight=512;
    let pipex=boardWidth;
    let pipeY=0;
    let topPipeImg;
    let bottomPipeImg;
    

    window.onload=function(){
        board=document.getElementById("board")
        board.height=boardHeight;
        board.width=boardWidth;
        context=board.getContext("2d");

    //      draw  bird
    // context.fillStyle="green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);


    //loadImages
    birdImg=new Image();
    birdImg.src="./flappybird.png"
    birdImg.onload=()=>{
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    }
    topPipeImg=new Image();  
    topPipeImg.src="./toppipe.png" ;
    bottomPipeImg=new Image();   
    bottomPipeImg.src="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(PlacePipes,1500);
    document.addEventListener("keydown",moveBird)

    }
    function update(){
        requestAnimationFrame(update);
        if(gameover){
            return;
        }
        context.clearRect(0,0,board.width,board.height);

        //bird
        velocityY+=gravity;
        bird.y=Math.max(bird.y+velocityY,0);
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
        if(bird.y>board.height){
            gameover=true;
        }

        //Pipes
        for(let i=0;i<pipeArray.length;i++){
            let pipe=pipeArray[i];
            pipe.x+=velocityX; 
            context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);


            if(!pipe.passed&&bird.x>pipe.x+pipe.width){
                score+=0.5;//2 pipes
                pipe.passed=true;
            }


            if (detectCollision(bird,pipe)){
                gameover=true;
            }
        }
        while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
            pipeArray.shift();
        }
        //score
        context.fillStyle="white";
        context.font="45px sans-serif";
        context.fillText(score,5,45);

        if(gameover){
            context.fillStyle="black";
            context.fillText("GAME OVER",50,300);
        }
    }
        
    function PlacePipes(){
        //(0-1)*pipe-Height/2
        //0->-128(pipeHeight/4)
        //1->-128--256(pipeHeight/4-pipeHeight/2)=-3/4 pipeHeight
    let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let clearSpace=boardHeight /4;
        let topPipe={
            img:topPipeImg,
            x:pipex,
            y:randomPipeY   ,
            width:pipeWidth,
            height:pipeHeight,
            passed:false
        }
        let bottomPipe={
            img:bottomPipeImg,
            x:pipex,
            y:randomPipeY+clearSpace+pipeHeight,
            width:pipeWidth,
            height:pipeHeight,
            passed:false
        }
        pipeArray.push(topPipe);
        pipeArray.push(bottomPipe);
    }
    function moveBird(e){
        if(e.code=="Space"||e.code=="ArrowUp"||e.code=="KeyX"){
            //jump
            velocityY=-6;
        }

        if(gameover){
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameover=false;
        }
    }
    function detectCollision(bird,pipe){
        return bird.x<pipe.x+pipe.width&&
        bird.x+bird.width>pipe.x&&
        bird.y<pipe.y+pipe.height&&
        bird.y+bird.height>pipe.y
    }