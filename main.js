$(function () {



    var canvas,
        context,
        dragging = false, //initially mouse drag is false. We will make this true when we are on mousedown while on mousemove
        dragStartLocation, // this will capture the x and y coordinate when press mousedown event
        snapshot,
        shape;


    function getCanvasCoordinates(event) {
        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        return {
            x: x,
            y: y
        };
    }

    function takeSnapshot() { // this will take the snapshot of the previous shapes we did when we press mousedown
        snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    function restoreSnapshot() { // put the image back into canvas
        context.putImageData(snapshot, 0, 0);

    }

    function drawErase(position) {

        context.beginPath();
        context.strokeStyle = '#fff'
        context.moveTo(dragStartLocation.x, dragStartLocation.y);
        context.lineTo(position.x, position.y);

    }


    function drawLine(position) { //position will be the last point of the line
        context.strokeStyle = document.getElementById('strokeColor').value
        context.beginPath();
        context.moveTo(dragStartLocation.x, dragStartLocation.y);
        context.lineTo(position.x, position.y);

    }


    function drawCircle(position) {

        var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
        context.beginPath();
        context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);

    }

    function drawArc(position) {
        var x = dragStartLocation.x;
        var y = dragStartLocation.y;
        var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));;
        var startAngle = (Math.PI * (dragStartLocation.x - position.x)) / 180;
        var endAngle = (Math.PI * (dragStartLocation.y - position.y)) / 180;

        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, false);


    }

    function drawPolygon(position, sides, angle) {
        context.strokeStyle = document.getElementById('strokeColor').value
        var coordinates = [];
        var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
        index = 0;

        for (index = 0; index < sides; index++) {
            coordinates.push({
                x: dragStartLocation.x + radius * Math.cos(angle),
                y: dragStartLocation.y - radius * Math.sin(angle)
            })
            angle += (2 * Math.PI) / sides;
        }
        context.beginPath();
        context.moveTo(coordinates[0].x, coordinates[0].y);
        for (index = 1; index < sides; index++) {
            context.lineTo(coordinates[index].x, coordinates[index].y);
        }

        context.closePath();
    }

    function draw(position, shape) {
        var fill = document.getElementById('fill');
        var shape = document.querySelector('input[type="radio"][name="shape"]:checked').value;
        var polygonSides = document.getElementById('polygonSides').value;
        var polygonAngle = document.getElementById('polygonAngle').value;



        if (shape === 'circle') {
            drawCircle(position);
        }
        if (shape === 'arc') {
            drawArc(position);
        }
        if (shape === 'line') {
            drawLine(position);
        }
        if (shape === 'erase') {
            drawErase(position);
        }
        if (shape === 'polygon') {
            drawPolygon(position, polygonSides, polygonAngle * (Math.PI / 180));
        }
        
        if (fill.checked) {
            context.fill()

        } else {
            context.stroke();
        }
    }



    function dragStart(event) { // this will be called on mousedown event
        dragging = true;
        dragStartLocation = getCanvasCoordinates(event);
        takeSnapshot();

    }

    function drag(event) {
        var position; // position is declared here
        if (dragging == true) {
            restoreSnapshot();
            position = getCanvasCoordinates(event);
            draw(position, 'polygon');


        }
    }

    function dragStop(event) {
        dragging = false;
        var position = getCanvasCoordinates(event);
        draw(position, 'polygon');




    }

    function changeLineWidth() {
        context.lineWidth = this.value;
        event.stopPropagation;
    }

    function changeFillStyle() {
        context.fillStyle = this.value;
        event.stopPropagation;
    }

    function changeStrokeColor() {
        context.strokeStyle = this.value;
        event.stopPropagation;
    }

    function resetCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }



    $('#save').click(function () {
        if (typeof (localStorage) != null) { // this checks if the browser supports local storage
            localStorage.setItem('imgCanvas', canvas.toDataURL());
        } else {
            window.alert('Your browser does not support local storage');
        }
    });



    function init() {
        canvas = document.getElementById('paint');
        context = canvas.getContext('2d');
        var lineWidth = document.getElementById('lineWidth');
        var fillColor = document.getElementById('fillColor');
        var strokeColor = document.getElementById('strokeColor');
        var clearCanvas = document.getElementById('clearCanvas');

        // var undo = document.getElementById('undo');
        // var redo = document.getElementById('redo');
        

        context.strokeStyle = strokeColor.value;
        context.fillStyle = fillColor.value;
        context.lineWidth = lineWidth.value;
        context.lineCap = 'round';

        //Event Listeners

        canvas.addEventListener('mousedown', dragStart, false);
        canvas.addEventListener('mousemove', drag, false);
        canvas.addEventListener('mouseup', dragStop, false);
        lineWidth.addEventListener('input', changeLineWidth, false);
        fillColor.addEventListener('input', changeFillStyle, false);
        strokeColor.addEventListener('input', changeStrokeColor, false);
        clearCanvas.addEventListener('click', resetCanvas, false);

        // undo.addEventListener('click', undo, false);
        // redo.addEventListener('click', redo, false);

        
        // this will trigger once the page loads
        if (localStorage.getItem('imgCanvas') != null) {
            var img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0);
            }
            img.src = localStorage.getItem('imgCanvas');
        }



    }


    window.addEventListener('load', init, false);




}); // do not delete this line


