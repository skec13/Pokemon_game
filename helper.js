    ///////////// canvas definition /////////////
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
    console.log(canvas.width + ", " + canvas.height);
        


    ///////////// offset object ///////////////
    var offset = {
        x: -1225 + canvas.width/2,
        y: -880 + canvas.height/2
    }

    ///////////// resize handler ///////////////
    /*
    function onResize () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        offset.x = -1225 + canvas.width/2;
        offset.y = -880 + canvas.height/2;
        background.updateResize();
        player.updateResize();
        foreground.updateResize();
    

    }
    */
    class Ocean {
        constructor({position}){
            this.image = document.getElementById("ocean");
            this.position = position;
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.elapsed = 0;
            this.speed = Math.floor(Math.random() * 60) + 50; 
        }
        draw(context){
            context.drawImage(this.image, this.frameY * 48, this.frameX * 48, 48, 48, this.position.x, this.position.y, 48, 48);
        }
        update(){
            this.elapsed++;
            if(this.elapsed % this.speed === 0){
                this.elapsed = 0;
                this.frameY++;
                if(this.frameY === 3) this.frameY = 0;
            }
        }
    }
    
        ///////////// boundary class /////////////
    class Boundary {
        static width = 48;
        static height = 48;
        constructor({position}) {
            this.position = position;
            this.width = 48;
            this.height = 48;
        }
        draw(context){
            context.fillStyle = "rgba(255, 0, 0, 0.2)";
            context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    
    ///////////// battle zones /////////////
    const battleZonesMap = [];
    for (let i = 0; i < battleZonesData.length; i += 70){
        battleZonesMap.push(battleZonesData.slice(i, 70 + i));
    }
    
    const battleZones = [];
    battleZonesMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if(symbol == 1025){
                battleZones.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x, 
                        y: i * Boundary.height + offset.y
                    }
                })
                )     
            }
        });
    });

    
    ///////////// boundaries array /////////////
    const collisionsMap = [];
    for (let i = 0; i < collisions.length; i += 70){
        collisionsMap.push(collisions.slice(i, 70 + i));
    }
    
    const boundaries = [];
    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if(symbol == 1025){
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x, 
                        y: i * Boundary.height + offset.y
                    }
                })
                )     
            }
        });
    });
    

    ///////////// background class /////////////
    class Background{
        constructor({position, velocity}){
            this.image = document.getElementById("img1");
            this.position = position;
        }
        draw(context){
            context.drawImage(this.image, this.position.x, this.position.y);
        }
    }
    
    
    ///////////// player class /////////////
    class Player{
        constructor({position}){
            this.imageDown = document.getElementById("playerDown");
            this.imageUp = document.getElementById("playerUp");
            this.imageLeft = document.getElementById("playerLeft");
            this.imageRight = document.getElementById("playerRight");
            this.array = [this.imageDown, this.imageUp, this.imageLeft, this.imageRight];
            this.image = this.array[0];
            this.width = 48;
            this.height = 68;
            this.position = position;
            //this.positionX = canvas.width / 2;
            //this.positionY = canvas.height / 2;
            this.frame = 0;
            this.elapsed = 0;
            this.moving = false;
        }
        draw(context){
            context.drawImage(
                this.image, 
                this.frame * 48,  //crop start x
                0,  //crop start y
                this.imageDown.width / 4,  //crop width
                this.imageDown.height,  //crop height
                this.position.x, 
                this.position.y,
                this.imageDown.width / 4,
                this.imageDown.height
            );
            if(!this.moving) return;
                this.elapsed++;
                if(this.elapsed % 10 === 0){
                    this.elapsed = 0;
                    if(this.frame < 3){
                        this.frame ++;
                    }
                    else {
                        this.frame = 0;
                    }               
                }     
        }
        update(x){
            this.image = this.array[x];
        }
    }


    ///////////// foreground class /////////////
    class Foreground{
        constructor({position}){
            this.image = document.getElementById("foreground");
            this.position = position;
        }
        draw(context){
            context.drawImage(this.image, this.position.x, this.position.y);
        }
        
    }


    ///////////// key bindings /////////////
    const keys = {
        w: {
            pressed: false
        },
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        s: {
            pressed: false
        }
    }
    
    let lastKey = '';
    
    window.addEventListener('keydown', (e) => {
         switch(e.key){
            case 'w':
                 keys.w.pressed = true;
                 lastKey = 'w';
                 break;
            case 'a':
                 keys.a.pressed = true;
                 lastKey = 'a';
                 break;
            case 's':
                 keys.s.pressed = true;
                 lastKey = 's';
                 break;
            case 'd':
                 keys.d.pressed = true;
                 lastKey = 'd';
                 break;
         }
    });
    
    window.addEventListener('keyup', (e) => {
         switch(e.key){
            case 'w':
                 keys.w.pressed = false;
                 break;
            case 'a':
                 keys.a.pressed = false;
                 break;
            case 's':
                 keys.s.pressed = false;
                 break;
            case 'd':
                 keys.d.pressed = false;
                 break;
         }
    });

    

    ///////////// buttonsPressed function ///////////////
    function buttonsPressed(){
        if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
            for(let i = 0; i < battleZones.length; i++){
                const battleZone = battleZones[i];
                const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y));
                if(
                    collisionDetection({
                        rectangle1: player,
                        rectangle2: battleZone
                    }) && overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.01
                ){
                    console.log("battleZone");
                    break;
                }
            }
        }
        let moving = true;
        player.moving = false;
        if(keys.w.pressed && lastKey === 'w'){
            player.moving = true;
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if(
                    collisionDetection({
                        rectangle1: player,
                        rectangle2: {...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }}
                    })
                ){
                    //console.log("colliding");
                    moving = false;
                    break;
                }
            }
            if(moving){
                movables.forEach((movable) => {
                    movable.position.y += 3;
                });
                player.update(1); 
            }
        } 
        else if(keys.a.pressed && lastKey === 'a'){
            player.moving = true;
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if(
                    collisionDetection({
                        rectangle1: player,
                        rectangle2: {...boundary, position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }}
                    })
                ){
                    //console.log("colliding");
                    moving = false;
                    break;
                }
            }
            if(moving){
                movables.forEach((movable) => {
                    movable.position.x += 3;
                });
                player.update(2); 
            }
        }
        else if(keys.s.pressed && lastKey === 's'){
            player.moving = true;
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if(
                    collisionDetection({
                        rectangle1: player,
                        rectangle2: {...boundary, position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }}
                    })
                ){
                    //console.log("colliding");
                    moving = false;
                    break;
                }
            }
            if(moving){
                movables.forEach((movable) => {
                    movable.position.y -= 3;
                });
                player.update(0); 
            }
        }
        else if(keys.d.pressed && lastKey === 'd'){
            player.moving = true;
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i];
                if(
                    collisionDetection({
                        rectangle1: player,
                        rectangle2: {...boundary, position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }}
                    })
                ){
                    //console.log("colliding");
                    moving = false;
                    break;
                }
            }
            if(moving){
                movables.forEach((movable) => {
                    movable.position.x -= 3;
                });
                player.update(3); 
            }
        }
    }


    ///////////// collision detection function ///////////////
    function collisionDetection({rectangle1, rectangle2}) {
        
        
        return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x + 10 && rectangle1.position.x  + 10<= rectangle2.position.x + rectangle2.width && rectangle1.position.y + 40<= rectangle2.position.y + rectangle2.height && rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
    }


    ///////////// new objects ///////////////
    const background = new Background({position: {x: offset.x, y: offset.y}});
    const player = new Player({position: {x: canvas.width/2, y: canvas.height/2}});
    const foreground = new Foreground({position: {x: offset.x, y: offset.y}});
    const oceanArray = [];
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 40; j++){
            oceanArray.push(new Ocean({position: {x: 48 * i + offset.x, y: 48 * j + offset.y}}));
        }
    }
    const ocean = new Ocean({position: {x: 500, y: 500}});


    //////////// arrays //////////////
    const movables = [background, ...boundaries, foreground, ...battleZones, ...oceanArray];


    
    /*
    window.addEventListener('resize', () =>{
        //location.reload();
        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;
    });
    */
   