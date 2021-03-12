//  CardGame Object has these 2 public methods:
//  CardGame.cardClicked()
//  CardGame.initializeNewGame()
var CardGame = (function(){

	//--------------------
	//PRIVATE Data
	//--------------------
	var wrapper = document.getElementById('insertCardsHere');
	var textScreen = document.getElementById('infoScreen'); 
	var cardClone = wrapper.children[0];
	var toggleBtn = document.getElementById('togBtn');
	cardClone.remove(); /* remove from DOM - used as template which can be cloned when creating new cards  */
	var imgArr = [
		'1_Dwarfs',
		'2_Spider',
		'3_Thorin',
		'4_Gandalf',
		'5_Smog',
		'6_Bard',
		'7_Trolls',
		'8_Wood Elf',
		'9_Great Goblin',
		'A_Gollum',
		'B_Bilbo',
		'C_Elrond'
	];
	imgArr.forEach( (e,i,a) => { a[i] = "images/"+e+"-min.jpg "; } );
	imgArr = imgArr.concat( imgArr );
	var firstCard = null;
	var secondCard = null;
	var matchesLeft = null;
	var turnsTaken = null;
	var firstGame = true;

	//Firefox Refresh State of Checkbox:
	toggleBtn.checked = false;

	//--------------------
	//PRIVATE Helper Functions
	//--------------------

	//       shuffle called by: initializeNewGame()
	function shuffle(array) {

		var index = array.length;
		var indexValue;
		var randomIndex;
		while (0 !== index) {
			randomIndex = Math.floor(Math.random() * index);
			index -= 1;
			//swap
			indexValue = array[index];
			array[index] = array[randomIndex];
			array[randomIndex] = indexValue;
		}
		return array;
	}

	//       gameOver called by: yesMatch()
	function gameOver(){
		//Show Message:
		textScreen.classList.remove('animate__flipOutX');
		textScreen.querySelectorAll('.displayNone').forEach( (e) => { e.classList.remove('displayNone') } );
		document.getElementById('turns').innerText = turnsTaken;
		toggleBtn.checked = false;
		toggleBtn.removeAttribute('disabled');
		console.log('game over');
	}

	//	     notMatch called by: checkForMatch()
	function notMatch(){
		firstCard.element.classList.remove('flipped');
		secondCard.element.classList.remove('flipped');
		firstCard = null;
		secondCard = null;
		++turnsTaken;	
	}

	//		 yesMatch called by: checkForMatch()
	function yesMatch(){
		if ( --matchesLeft == 0) {
			//Special Animation on very last match:
			firstCard.element.classList.add('animate__hinge');
			secondCard.element.classList.add('animate__hinge');
			setTimeout( gameOver, 2000);
		}else{
			firstCard.element.classList.add('hidden');
			secondCard.element.classList.add('hidden'); 
		}
		firstCard = null;
		secondCard = null;
	}

	//		 checkForMatch called by: cardClicked()
	function checkForMatch(){
		if ( firstCard.name == secondCard.name) {
			setTimeout( yesMatch, 1000);
		} else{
			setTimeout( notMatch, 1000);
		}
	}
	
	//		 getCharacterName called by: cardClicked() & initializeNewGame()
	function getCharacterName( imageRelativePath ){
		return imageRelativePath.split('_')[1].split('-')[0];
	}

	return {

	//--------------------
	//PUBLIC
	//--------------------
		cardClicked : function( cardEle ){
			var nameOnCard = getCharacterName( cardEle.querySelector('.flip-box-back img').src );

			if ( firstCard == null) {
				firstCard = { element: cardEle, name: nameOnCard };
				firstCard.element.classList.add('flipped');
				console.log('first card');
			}
			else if ( secondCard == null && firstCard.element != cardEle ) {
				secondCard = { element: cardEle, name: nameOnCard };
				secondCard.element.classList.add('flipped');
				checkForMatch();
				console.log('second card');
			} else {
				console.log('ignore click');
			}

		},
		initializeNewGame : function(){
			//Fullscreen
			if ( firstGame ) {
				firstGame = false;
				if ( document.body.requestFullscreen) {
					document.body.requestFullscreen();
				}
			}
			//disable toggle
			toggleBtn.setAttribute('disabled',true);
			//animate window hiding
			textScreen.classList.add('animate__flipOutX');
			//remove all existing cards, needed if this a subsequent game.
			while (wrapper.firstChild) {
				wrapper.lastChild.remove();
			}
			//shuffle and display cards:
			imgArr = shuffle(imgArr);
			imgArr.forEach( (e,i) => {
				var newCard = cardClone.cloneNode(true);
				newCard.querySelector('.flip-box-back img').src = imgArr[i];
				newCard.querySelector('.character').innerText = getCharacterName( imgArr[i] );
				wrapper.appendChild( newCard );
			} );
			//init variables:
			matchesLeft = 12;
			turnsTaken = 1;
			firstCard = null;
			secondCard = null;
		}
	}
}());