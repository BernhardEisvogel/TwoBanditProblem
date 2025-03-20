(function () {
  const items = [
    '🍭',
    '❌',
    '⭐',
    '🍎',
    '⛄️'
  ];
  const left_doors = document.querySelectorAll('#left_doors > .door');
  const right_doors = document.querySelectorAll('#right_doors > .door');
  const wins =  document.querySelector('#wins');
  const tries =  document.querySelector('#tries');
  const probaLeft = 0.45 + Math.random() * 0.3;
  const probaRight = 0.45 + Math.random() * 0.3;

  document.getElementById("proba_left").innerHTML = Math.floor(100*probaLeft)/100;
  document.getElementById("proba_right").innerHTML = Math.floor(100*probaRight)/100;
  
  document.querySelector('#spinner_left').addEventListener('click', function(event) { spin(left_doors, probaLeft);});

  document.querySelector('#spinner_right').addEventListener('click', function(event) { spin(right_doors, probaRight);});

  function init(firstInit = true, groups = 1, duration = 1, winningProba = 1.0, doors) {

    const winner = Math.floor(Math.random() * items.length);
    const winning = (Math.random()<=winningProba);
    var count = 0;
    for (const door of doors) {
      count++;
      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      const pool = ['❓'];

      if (!firstInit) {

        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }

	if (count == 1 || winning) {
          pool.push(...shuffle(arr, winner));
	}else{
          pool.push(...shuffle(arr, winner + Math.floor(1 + Math.random() * 2)));
	}

        boxesClone.addEventListener(
          'transitionstart',
          function () {
            door.dataset.spinned = '1';
            this.querySelectorAll('.box').forEach((box) => {
              box.style.filter = 'blur(1px)';
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          'transitionend',
          function () {
            this.querySelectorAll('.box').forEach((box, index) => {
              box.style.filter = 'blur(0)';
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  async function spin(doors, winningProba) {
    init(false, 1, 2, winningProba, doors);
    if(parseInt(tries.innerHTML) == 10) {
	document.getElementById("spinners").style.display = "none";
        document.getElementById("info_section").style.display = "block"; // Show info section
    	return;
    }

    tries.innerHTML = parseInt(tries.innerHTML) + 1;

    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }

    var same = doors[0].querySelectorAll('.box')[0].innerHTML === doors[1].querySelectorAll('.box')[0].innerHTML; 

    wins.innerHTML = parseInt(wins.innerHTML) + same;
  }

  function shuffle([...arr], winningElement) {
    let m = arr.length-1;
    [arr[m], arr[winningElement]] = [arr[winningElement], arr[m]];
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    console.log(arr);
    return arr;
  }

  init(true, 1, 2, 1.0, right_doors);
  init(true, 1, 2, 1.0, left_doors);
})();


document.querySelectorAll('.lever').forEach(lever => {
    lever.addEventListener('click', function() {
        this.classList.add('pull');
        setTimeout(() => {
            this.classList.remove('pull');
        }, 500);
    });
});
