THREE.TrackballControls=function(e,t){function n(e){d.enabled!==!1&&(window.removeEventListener("keydown",n),E=g,g===p.NONE&&(e.keyCode!==d.keys[p.ROTATE]||d.noRotate?e.keyCode!==d.keys[p.ZOOM]||d.noZoom?e.keyCode!==d.keys[p.PAN]||d.noPan||(g=p.PAN):g=p.ZOOM:g=p.ROTATE))}function o(e){d.enabled!==!1&&(g=E,window.addEventListener("keydown",n,!1))}function i(e){d.enabled!==!1&&(e.preventDefault(),e.stopPropagation(),g===p.NONE&&(g=e.button),g!==p.ROTATE||d.noRotate?g!==p.ZOOM||d.noZoom?g!==p.PAN||d.noPan||(w=M=d.getMouseOnScreen(e.clientX,e.clientY)):b=v=d.getMouseOnScreen(e.clientX,e.clientY):f=O=d.getMouseProjectionOnBall(e.clientX,e.clientY),document.addEventListener("mousemove",s,!1),document.addEventListener("mouseup",a,!1))}function s(e){d.enabled!==!1&&(e.preventDefault(),e.stopPropagation(),g!==p.ROTATE||d.noRotate?g!==p.ZOOM||d.noZoom?g!==p.PAN||d.noPan||(M=d.getMouseOnScreen(e.clientX,e.clientY)):v=d.getMouseOnScreen(e.clientX,e.clientY):O=d.getMouseProjectionOnBall(e.clientX,e.clientY))}function a(e){d.enabled!==!1&&(e.preventDefault(),e.stopPropagation(),g=p.NONE,document.removeEventListener("mousemove",s),document.removeEventListener("mouseup",a))}function c(e){if(d.enabled!==!1){e.preventDefault(),e.stopPropagation();var t=0;e.wheelDelta?t=e.wheelDelta/40:e.detail&&(t=-e.detail/3),b.y+=.01*t}}function r(e){if(d.enabled!==!1)switch(e.touches.length){case 1:g=p.TOUCH_ROTATE,f=O=d.getMouseProjectionOnBall(e.touches[0].pageX,e.touches[0].pageY);break;case 2:g=p.TOUCH_ZOOM;var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY;T=y=Math.sqrt(t*t+n*n);break;case 3:g=p.TOUCH_PAN,w=M=d.getMouseOnScreen(e.touches[0].pageX,e.touches[0].pageY);break;default:g=p.NONE}}function h(e){if(d.enabled!==!1)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:O=d.getMouseProjectionOnBall(e.touches[0].pageX,e.touches[0].pageY);break;case 2:var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY;T=Math.sqrt(t*t+n*n);break;case 3:M=d.getMouseOnScreen(e.touches[0].pageX,e.touches[0].pageY);break;default:g=p.NONE}}function u(e){if(d.enabled!==!1){switch(e.touches.length){case 1:f=O=d.getMouseProjectionOnBall(e.touches[0].pageX,e.touches[0].pageY);break;case 2:y=T=0;break;case 3:w=M=d.getMouseOnScreen(e.touches[0].pageX,e.touches[0].pageY)}g=p.NONE}}var d=this,p={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM:4,TOUCH_PAN:5};this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.screen={width:0,height:0,offsetLeft:0,offsetTop:0},this.radius=(this.screen.width+this.screen.height)/4,this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.keys=[65,83,68],this.target=new THREE.Vector3;var l=new THREE.Vector3,g=p.NONE,E=p.NONE,m=new THREE.Vector3,f=new THREE.Vector3,O=new THREE.Vector3,b=new THREE.Vector2,v=new THREE.Vector2,y=0,T=0,w=new THREE.Vector2,M=new THREE.Vector2;this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.up0=this.object.up.clone();var j={type:"change"};this.handleResize=function(){this.screen.width=window.innerWidth,this.screen.height=window.innerHeight,this.screen.offsetLeft=0,this.screen.offsetTop=0,this.radius=(this.screen.width+this.screen.height)/4},this.handleEvent=function(e){"function"==typeof this[e.type]&&this[e.type](e)},this.getMouseOnScreen=function(e,t){return new THREE.Vector2((e-d.screen.offsetLeft)/d.radius*.5,(t-d.screen.offsetTop)/d.radius*.5)},this.getMouseProjectionOnBall=function(e,t){var n=new THREE.Vector3((e-.5*d.screen.width-d.screen.offsetLeft)/d.radius,(.5*d.screen.height+d.screen.offsetTop-t)/d.radius,0),o=n.length();o>1?n.normalize():n.z=Math.sqrt(1-o*o),m.copy(d.object.position).sub(d.target);var i=d.object.up.clone().setLength(n.y);return i.add(d.object.up.clone().cross(m).setLength(n.x)),i.add(m.setLength(n.z)),i},this.rotateCamera=function(){var e=Math.acos(f.dot(O)/f.length()/O.length());if(e){var t=(new THREE.Vector3).crossVectors(f,O).normalize();quaternion=new THREE.Quaternion,e*=d.rotateSpeed,quaternion.setFromAxisAngle(t,-e),m.applyQuaternion(quaternion),d.object.up.applyQuaternion(quaternion),O.applyQuaternion(quaternion),d.staticMoving?f.copy(O):(quaternion.setFromAxisAngle(t,e*(d.dynamicDampingFactor-1)),f.applyQuaternion(quaternion))}},this.zoomCamera=function(){if(g===p.TOUCH_ZOOM){var e=y/T;y=T,m.multiplyScalar(e)}else{var e=1+(v.y-b.y)*d.zoomSpeed;1!==e&&e>0&&(m.multiplyScalar(e),d.staticMoving?b.copy(v):b.y+=(v.y-b.y)*this.dynamicDampingFactor)}},this.panCamera=function(){var e=M.clone().sub(w);if(e.lengthSq()){e.multiplyScalar(m.length()*d.panSpeed);var t=m.clone().cross(d.object.up).setLength(e.x);t.add(d.object.up.clone().setLength(e.y)),d.object.position.add(t),d.target.add(t),d.staticMoving?w=M:w.add(e.subVectors(M,w).multiplyScalar(d.dynamicDampingFactor))}},this.checkDistances=function(){d.noZoom&&d.noPan||(d.object.position.lengthSq()>d.maxDistance*d.maxDistance&&d.object.position.setLength(d.maxDistance),m.lengthSq()<d.minDistance*d.minDistance&&d.object.position.addVectors(d.target,m.setLength(d.minDistance)))},this.update=function(){m.subVectors(d.object.position,d.target),d.noRotate||d.rotateCamera(),d.noZoom||d.zoomCamera(),d.noPan||d.panCamera(),d.object.position.addVectors(d.target,m),d.checkDistances(),d.object.lookAt(d.target),l.distanceToSquared(d.object.position)>0&&(d.dispatchEvent(j),l.copy(d.object.position))},this.reset=function(){g=p.NONE,E=p.NONE,d.target.copy(d.target0),d.object.position.copy(d.position0),d.object.up.copy(d.up0),m.subVectors(d.object.position,d.target),d.object.lookAt(d.target),d.dispatchEvent(j),l.copy(d.object.position)},this.domElement.addEventListener("contextmenu",function(e){e.preventDefault()},!1),this.domElement.addEventListener("mousedown",i,!1),this.domElement.addEventListener("mousewheel",c,!1),this.domElement.addEventListener("DOMMouseScroll",c,!1),this.domElement.addEventListener("touchstart",r,!1),this.domElement.addEventListener("touchend",u,!1),this.domElement.addEventListener("touchmove",h,!1),window.addEventListener("keydown",n,!1),window.addEventListener("keyup",o,!1),this.handleResize()},THREE.TrackballControls.prototype=Object.create(THREE.EventDispatcher.prototype);