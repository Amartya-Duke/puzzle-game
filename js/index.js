(function() {
    bindEventListner();
    var n = 4; //defines size of grid n*n
    var moveIndex = 0; //used for displaying in moveHistory sidebar
    var noOfMoves = 0; // counts number of moves
    var tileMovesHistory = new Array(); //queue storing the last 5 moves
    var array = new Array(n); //all grid data is stored in this array
    var timer; //in minutes
    var blankTileIndex; //index of blank tile


    for (var i = 0; i < n; i++)
        array[i] = new Array(n);
    var k = 1;
    for (var i = 0; i < n; i++)
        for (var j = 0; j < n; j++)
            array[i][j] = k++;
    array[n - 1][n - 1] = 0;


    //binds all event listner
    function bindEventListner() {
        document.getElementById('custom-btn ').addEventListener('click', startCustomGame);
        document.getElementById('new-game').addEventListener('click', shuffleArray);

        document.getElementById('undo').addEventListener('click', undoHistory);

        //Drag and drop event listners

        document.addEventListener("dragstart", function(event) {
            console.log("drag start");

            event.target.classList.add("tile-dragging");
            event.dataTransfer.setData("tile-number", event.target.childNodes[1].innerHTML);
            event.dataTransfer.setData('tile-index', event.target.getAttribute('data-tile-index'));
            event.dataTransfer.setData('tile', event.target);

        });

        document.addEventListener("drag", function(event) {
            // console.log("dragging...");
        });

        /* Events fired on the drop target */
        document.addEventListener("dragover", function(event) {
            // console.log("drag over");
            event.preventDefault();
        });

        document.addEventListener("drop", function(event) {
            event.preventDefault();
            // console.log("drop")
            if (event.target.innerHTML == "") {
                event.preventDefault();
                var data = parseInt(event.dataTransfer.getData("tile-number"));
                var tileIndex = parseInt(event.dataTransfer.getData('tile-index'));

                moveTile(false, data, tileIndex, event.target.parentElement)

            }
        });
    }

    function setTimer(time) {
        setTimeout(function() {
            alert('Timer out')
        }, time * 60 * 1000);
        document.getElementById('time-left').innerHTML = time;
        setInterval(function() {
            document.getElementById('time-left').innerHTML = --time + " mins left";
        }, 60 * 1000)
    }


    //Using the Fisher-Yates (aka Knuth) Shuffle algorithn for shuffling
    //This function is not used in the program due to minor bugs
    function shuffle(ar) {
        var k = 0;
        var shuffledArray = new Array();
        for (var i = 0; i < n; i++)
            for (var j = 0; j < n; j++)
                shuffledArray.push(array[i][j]);
        var currentIndex = shuffledArray.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = shuffledArray[currentIndex];
            shuffledArray[currentIndex] = shuffledArray[randomIndex];
            shuffledArray[randomIndex] = temporaryValue;
        }
        var k = 0;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++)
                array[i][j] = shuffledArray[k++];
        }
    }

    //main function which populates the game grid
    function populateGame(n, array) {
        var tileIndex = 0;
        var tiles = document.getElementsByClassName('tiles');
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                tiles[tileIndex].setAttribute('data-tile-index', tileIndex);
                if (array[i][j] != 0) {
                    tiles[tileIndex].childNodes[1].innerHTML = array[i][j];
                } else {
                    blankTileIndex = tileIndex;
                }
                tileIndex++;
            }
        }
        setTimer(timer);
        setDraggable(blankTileIndex, n);
    }

    //this function sets appropriate tile as draggable, takes tileindex of blank tile and n , the size of array(nxn)
    function setDraggable(tileIndex, n) {

        var tiles = document.getElementsByClassName('tiles');
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].setAttribute("draggable", "false");

        }

        //handlng 4 corners
        if (tileIndex == 0) {
            tiles[tileIndex + 1].setAttribute('draggable', "true");
            tiles[tileIndex + n].setAttribute('draggable', "true");
        } else if (tileIndex == n - 1) {
            tiles[tileIndex - 1].setAttribute('draggable', "true");
            tiles[tileIndex + n].setAttribute('draggable', "true");
        } else if (tileIndex == n * n - 1) {
            tiles[tileIndex - 1].setAttribute('draggable', "true");
            tiles[tileIndex - n].setAttribute('draggable', "true");
        } else if (tileIndex == (n * n - n)) {
            tiles[tileIndex + 1].setAttribute('draggable', "true");
            tiles[tileIndex - n].setAttribute('draggable', "true");
        }
        //handling first row except corners
        else if (tileIndex > 0 && tileIndex < n - 1) {
            tiles[tileIndex - 1].setAttribute('draggable', "true");
            tiles[tileIndex + 1].setAttribute('draggable', "true");
            tiles[tileIndex + n].setAttribute('draggable', "true");
        }
        //handling last row except corners 
        else if (tileIndex > n * (n - 1) && tileIndex < (n * n - 1)) {
            tiles[tileIndex - 1].setAttribute('draggable', "true");
            tiles[tileIndex - n].setAttribute('draggable', "true");
            tiles[tileIndex + 1].setAttribute('draggable', "true");
        }
        //handling 1st column except corners 
        else if ((tileIndex) % n == 0) {
            tiles[tileIndex + 1].setAttribute("draggable", "true");
            tiles[tileIndex + n].setAttribute('draggable', "true");
            tiles[tileIndex - n].setAttribute('draggable', "true");
        }
        //handling nth column except corners  
        else if ((tileIndex) % n == n - 1) {
            tiles[tileIndex - 1].setAttribute("draggable", "true");
            tiles[tileIndex + n].setAttribute('draggable', "true");
            tiles[tileIndex - n].setAttribute('draggable', "true");
        }
        //handling other tiles
        else {
            tiles[tileIndex - 1].setAttribute('draggable', "true");
            tiles[tileIndex + 1].setAttribute('draggable', "true");
            tiles[tileIndex + n].setAttribute('draggable', "true");
            tiles[tileIndex - n].setAttribute('draggable', "true");
        }
        tiles[tileIndex].setAttribute('draggable', "false");
        tiles[tileIndex].childNodes[1].innerHTML = "";
        tiles[tileIndex].classList.remove("tile-dragging");
        tiles[tileIndex].classList.add("blank-tile");

    }


    //a modular function to move tile, takes data and sourceTileIndex and referenceToTarget tile as parameters. It also takes isFromUndo which checks if this function is called after clicking undo

    function moveTile(isFromUndo, data, sourceTileIndex, referenceToTarget) {
        referenceToTarget.childNodes[1].innerHTML = data;
        var targetTileIndex = parseInt(referenceToTarget.getAttribute('data-tile-index'));
        array[parseInt(targetTileIndex / n)][targetTileIndex % n] = data;
        array[parseInt(sourceTileIndex / n)][sourceTileIndex % n] = 0;
        referenceToTarget.classList.remove('blank-tile');
        referenceToTarget.draggable = "true";
        setDraggable(sourceTileIndex, n);
        setMoveHistory(data, parseInt(targetTileIndex / n) + 1, (targetTileIndex % n) + 1);
        if (!isFromUndo) {
            pushHistoryToStack(data, sourceTileIndex, targetTileIndex);
            checkForCompleteness();
            document.getElementById('no-of-moves').innerHTML = ++noOfMoves;
        }
    }

    function pushHistoryToStack(data, sourceTileIndex, targetTileIndex) {
        var index = 0;
        var queueData = {};
        queueData.data = data;
        queueData.sourceTileIndex = sourceTileIndex;
        queueData.targetTileIndex = targetTileIndex;
        tileMovesHistory.unshift(queueData);
        tileMovesHistory.length = tileMovesHistory.length < 5 ? tileMovesHistory.length : 5;
    }

    function checkForCompleteness() {
        var k = 1;
        var isComplete = true;
        if (array[n - 1][n - 1] != 0)
            return;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (array[i][j] == k || (i == n - 1 && j == n - 1)) {
                    k++;
                } else {
                    isComplete = false;
                    break;
                }
            }
        }
        if (isComplete)
            alert('Game Completed !');
    }

    function setMoveHistory(data, rowIndex, columnIndex) {
        //moveHistory(moveIndex % 5)
        var p = document.createElement('p');
        p.innerHTML = ++moveIndex + ". Tile " + data + " to " + rowIndex + "," + columnIndex;
        document.getElementById('my-moves ').appendChild(p);
    }


    function undoHistory() {
        var tiles = document.getElementsByClassName('tiles');
        var data = tileMovesHistory.shift();
        // for (var i = 1; i < tileMovesHistory.length; i++)
        //     tileMovesHistory[i - 1] = tileMovesHistory[i];
        var sourceTileIndex = data.targetTileIndex;
        var targetTile;
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].getAttribute('data-tile-index') == data.sourceTileIndex) {
                targetTile = tiles[i];
                break;
            }
        }
        moveTile(true, data.data, sourceTileIndex, targetTile);
    }


    function shuffleArray() {
        //not implemented shuffle due to minor bugs
        shuffle(array);
        timer = 10;
        populateGame(n, array);
    }


    function startCustomGame() {
        var size = prompt("Size of matrix(nxn). Enter n", "4");
        var time = prompt("Enter time in minutes", "10");
        n = size;
        timer = time;
        populateGame(n, array);
    }

})()