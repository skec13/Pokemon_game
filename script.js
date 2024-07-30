window.addEventListener('load', function () {
    
    

    ///////////// main animate function //////////// 
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        boundaries.forEach(boundary => {
            boundary.draw(ctx);
        });
        battleZones.forEach(battleZone => {
            battleZone.draw(ctx); 
        });
        player.draw(ctx);
        foreground.draw(ctx);
        oceanArray.forEach(ocean => {
            ocean.draw(ctx);
            ocean.update()
        })
        
        buttonsPressed();
        
        window.requestAnimationFrame(animate);
    }
    animate();
    
});