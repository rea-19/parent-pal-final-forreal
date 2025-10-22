//AI (ChatGPT) has been used with this code, for the following purposes: 
// to remove redundant code
// to error-check or correct, or to give advice on where to check for problems
// All base code is done by hand. AI changes have been changed and edited and have been used to improve, not to do the code itself. 

// wait for the class "progress-done" to load in the DOM
function waitForProgressBar(callback) {
  const checkExist = setInterval(() => {
    const progress = document.querySelector(".progress-done");
    if (progress) {
      clearInterval(checkExist);
      callback(progress);
    }
  }, 100); 
}


waitForProgressBar((progress) => {
  console.log("Progress bar ready");

  // load saved points 
  const loggedInUser = localStorage.getItem('loggedInUser') || 'guest';
  const storageKey = `rewards_${loggedInUser}`;

  let userPoints = 0;
  let goal = 50;

  function loadSavedPoints() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.userPoints === 'number') userPoints = parsed.userPoints;
      if (typeof parsed.goal === 'number') goal = parsed.goal;
    } catch (e) {
      console.warn('Failed to load saved rewards:', e);
    }
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ userPoints, goal }));
    } catch (e) {
      console.warn('Failed to save rewards:', e);
    }
  }

  loadSavedPoints();

  let lastPoints = userPoints;

    // updates the progress bar visually and the text
  function updateProgressBar() {
    if (!goal || goal <= 0) return;
    if (userPoints < 0) userPoints = 0;

    const percentage = Math.min((userPoints / goal) * 100, 100);

    // styling of the progress fill
    function setFillWidth(fromZero = false) {
      if (fromZero) {

        progress.style.transition = 'none';
        progress.style.width = '0%';

        progress.getBoundingClientRect();

        requestAnimationFrame(() => {
          progress.style.transition = 'width 0.5s ease-in-out';
          progress.style.width = `${percentage}%`;
        });
      } else {
        progress.style.transition = 'width 0.5s ease-in-out';
        progress.style.width = `${percentage}%`;
      }
    }
  // always animate from zero -> percentage 
  setFillWidth(true);
    // move runner relative to the progress fill's parent container
    const runner = progress.parentElement.querySelector("#runner");
    if (runner) {
      // place the runner a few percent behind the fill edge
      const runnerPercentage = Math.max(percentage - 1, 0); // -1% behind the progress filler
      // always animate runner from 0 -> target position
      runner.style.transition = 'none';
      runner.style.left = `0%`;
      runner.getBoundingClientRect();
      requestAnimationFrame(() => {
        runner.style.transition = 'left 0.5s ease-in-out';
        runner.style.left = `${runnerPercentage}%`;
      });
    }
  }

  window.addPoints = function (amount) {
    userPoints += amount;
    console.log(`You gained ${amount} points! Total: ${userPoints}`);
    checkGoal();
    save();
    updateProgressBar();
  };

  window.setGoal = function (newGoal) {
    goal = newGoal;
    console.log(`New goal set: ${goal} points`);
    save();
    updateProgressBar();
  };

  window.resetPoints = function () {
    userPoints = 0;
    console.log("Points reset");
    save();
    updateProgressBar();
  };

  function checkGoal() {
    if (lastPoints < goal && userPoints >= goal) {
      console.log('Goal reached!');
    }
    lastPoints = userPoints;
  }

  const input = document.getElementById("inputValue"); 
  const maxInput = document.getElementById("inputMax"); 

  if (input) {
    input.addEventListener("keyup", function () {
      userPoints = parseInt(input.value, 10) || 0;
      save();
      updateProgressBar();
    });
  }

  if (maxInput) {
    maxInput.addEventListener("keyup", function () {
      goal = parseInt(maxInput.value, 10) || 0;
      save();
      updateProgressBar();
    });
  }

  updateProgressBar();
});

// Reference: https://www.bing.com/videos/riverview/relatedvideo?q=how+do+i+make+an+item+flip+js&&view=riverview&mmscn=mtsc&mid=F9EDC31DB5C106C22CCFF9EDC31DB5C106C22CCF&&aps=240&FORM=VMSOVR
// Membership card flipped
function flipCard() {
  const card = document.getElementById("membershipCard");
  card.classList.toggle("flipped");
}
