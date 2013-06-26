APlayer = function( containerID, playerID ){
  var container = $('#'+containerID)
  var player = $('#'+playerID)
  window.player = player
  var self = this


  var pause = true

  this.start = function startAnimation(){
    pause = false
    this.arm()
    tick()
  }

  this.stop = function (){
    pause = true
  }

  this.arm = function(minAmount){
    minAmount = minAmount || 3
    setTimeout(function(){
       player.css({backgroundColor:"#66cc00"})
     }, minAmount*1000 + Math.random()*7300 )
  }

  function chooseRandomDestination(){
    return {
      top: player.height() + Math.random()*container.height()-2*player.height(),
      left: player.width() + Math.random()*container.width()-2*player.width()
    }
  }


  player.mousedown(function(){
    self.stop()
  })

  player.mouseup(function(){
    self.start()
    var rad = Math.random()*2*Math.PI
    var escapeVel = 20

    velocity = {top: escapeVel*Math.sin(rad), left: escapeVel*Math.cos(rad)}
    var oldTopSpeed = topSpeed
    topSpeed = escapeVel
    function slowDown(){
      topSpeed *= .99
      if( topSpeed <= oldTopSpeed ) return
      setTimeout( slowDown, 10 )
    }
    slowDown()

    player.css({backgroundColor:"#cc6600"})
  })


  var destination = chooseRandomDestination()
  var topSpeed = 3
  var acceleration = .1
  var velocity = {top:0, left:0}

  var tick = function tick(){
    if( pause ) return
    var top = player.offset().top - container.offset().top
    var left = player.offset().left - container.offset().left

    var dY = top - destination.top
    var dX = left - destination.left


    // Smoothly move towards the destination
    velocity.top = velocity.top  - (dY > 0 ? .1 : -.1)
    velocity.left = velocity.left - (dX > 0 ? .1 : -.1)

    velocity.top = Math.max(  -topSpeed, Math.min( topSpeed, velocity.top))
    velocity.left = Math.max( -topSpeed, Math.min( topSpeed, velocity.left))

    top += velocity.top
    left += velocity.left

    if( top + player.height() > container.height() || top < 0 ) velocity.top *= -1
    if( left + player.width() > container.width() || left < 0 ) velocity.left *= -1


    // If we get close to the destination, switch it up
    if( Math.abs(dY) < 100 && Math.abs(dX) < 100 ) destination = chooseRandomDestination()

    player.offset({top: top + container.offset().top, left: left + container.offset().left})

    setTimeout( tick, 20 )
  }

}

var Player = new APlayer('game', 'player')
Player.start()
Player.arm()