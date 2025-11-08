let playerHealth = 500;

let goblinHealth = 2000;
let orcHealth = 3000;
let giantHealth = 5000;
let iceDragonHealth = 14000;

let iceDragonActive = false;
let dragonRevealInProgress = false;

let goblinDefeated = false;
let orcDefeated = false;
let giantDefeated = false;
let iceDragonDefeated = false;

let hasStrengthElixir = false;
let hasRustyShield = false;

let ninjaStars = 8;
let strengthElixirs = 4;
let healingPotions = 5;

const divider = document.getElementById("divider");

const fightButton = document.getElementById("fightButton");
const itemButton = document.getElementById("itemButton");
const magicButton = document.getElementById("magicButton");
const summonButton = document.getElementById("summonButton");

const healingPotionButton = document.getElementById("healingPotionButton");
const ninjaStarButton = document.getElementById("ninjaStarButton");
const strengthElixirButton = document.getElementById("strengthElixirButton");
const rustyShieldButton = document.getElementById("rustyShieldButton");

const fireballButton = document.getElementById("fireballButton");
const thunderclapButton = document.getElementById("thunderclapButton");
const shadowVortexButton = document.getElementById("shadowVortexButton");
const iceRainButton = document.getElementById("iceRainButton");

const abyssDrakeButton = document.getElementById("abyssDrakeButton");
const miniHydraButton = document.getElementById("miniHydraButton");
const magicWolfButton = document.getElementById("magicWolfButton");

let abyssDrakeActive = false;
let abyssDrakeTurnsRemaining = 0;
let miniHydraActive = false;
let miniHydraTurnsRemaining = 0;
let magicWolfActive = false;
let magicWolfTurnsRemaining = 0;

const itemButtonsRow = document.getElementById("itemButtonsRow");
const magicButtonsRow = document.getElementById("magicButtonsRow");
const summonButtonsRow = document.getElementById("summonButtonsRow");

const messageText = document.getElementById("messageText");
const messageText2 = document.getElementById("messageText2");
const enemyHealthText = document.getElementById("enemyHealthText");
const playerHealthText = document.getElementById("playerHealthText");

function activeEnemyKey() {
  if (iceDragonActive) return "dragon";
  if (!goblinDefeated) return "goblin";
  if (!orcDefeated) return "orc";
  if (!giantDefeated) return "giant";
  return "none";
}

function applyDamageToActiveEnemy(amount) {
  const k = activeEnemyKey();
  if (k === "goblin") goblinHealth = Math.max(0, goblinHealth - amount);
  else if (k === "orc") orcHealth = Math.max(0, orcHealth - amount);
  else if (k === "giant") giantHealth = Math.max(0, giantHealth - amount);
  else if (k === "dragon") iceDragonHealth = Math.max(0, iceDragonHealth - amount);
}

function flashBody(cls, dur = 300) {
  document.body.classList.add(cls);
  setTimeout(() => document.body.classList.remove(cls), dur);
}

function shake() {
  document.getElementById("gameDiv").classList.add("shake-animation");
  document.getElementById("titleText").classList.add("shake-animation");
  setTimeout(() => {
    document.getElementById("gameDiv").classList.remove("shake-animation");
    document.getElementById("titleText").classList.remove("shake-animation");
  }, 400);
}

function shake2() {
  document.getElementById("gameDiv").classList.add("shake-animation2");
  document.getElementById("titleText").classList.add("shake-animation2");
  setTimeout(() => {
    document.getElementById("gameDiv").classList.remove("shake-animation2");
    document.getElementById("titleText").classList.remove("shake-animation2");
  }, 4000);
}

function setBtnEnabled(btn, enabled) {
  btn.disabled = !enabled;
  btn.style.backgroundColor = enabled ? "" : "gray";
  btn.style.cursor = enabled ? "" : "not-allowed";
}

function updateInventoryUI() {
  healingPotionButton.textContent = "Healing Potion (" + healingPotions + ")";
  ninjaStarButton.textContent = "Ninja Star (" + ninjaStars + ")";
  strengthElixirButton.textContent = "Strength Elixir (" + strengthElixirs + ")";

  setBtnEnabled(healingPotionButton, healingPotions > 0);
  setBtnEnabled(ninjaStarButton, ninjaStars > 0);
  setBtnEnabled(strengthElixirButton, strengthElixirs > 0);

  if (hasStrengthElixir) {
    fightButton.classList.add("button-glow");
    if (ninjaStars > 0) ninjaStarButton.classList.add("button-glow");
  } else {
    fightButton.classList.remove("button-glow");
    ninjaStarButton.classList.remove("button-glow");
  }
}

function updateEnemyDisplay() {
  if (iceDragonActive) {
    enemyHealthText.textContent = "Ice Dragon health: " + iceDragonHealth + "/14000";
    document.body.style.backgroundColor = "lightblue"
    return;
  }
  if (goblinDefeated && orcDefeated) {
    enemyHealthText.textContent = "Giant health: " + giantHealth + "/5000";
  } else if (goblinDefeated) {
    enemyHealthText.textContent = "Orc health: " + orcHealth + "/3000";
  } else {
    enemyHealthText.textContent = "Goblin health: " + goblinHealth + "/2000";
  }
}

function updatePlayerDisplay() {
  if(iceDragonActive) {
    document.body.style.backgroundColor = "lightblue"
  }
  playerHealth = Math.max(0, playerHealth);
  playerHealthText.textContent = "Your health: " + playerHealth + "/500";
  if (playerHealth < 1) {
    document.getElementById("gameDiv").style.display = "none";
    document.getElementById("titleText").textContent = "You died!";
  }
  if (iceDragonDefeated) {
    document.getElementById("gameDiv").style.display = "none";
    document.getElementById("titleText").textContent = "You won!";
  }
}

function grantOnKillRewards(enemyKey) {
  if (enemyKey === "goblin") {
    goblinDefeated = true;
    ninjaStars += 2;
    strengthElixirs += 1;
    messageText.textContent = "You got 2 ninja stars and 1 strength elixir!";
    messageText2.textContent = "An orc approached you!";
    updateInventoryUI();
  } else if (enemyKey === "orc") {
    orcDefeated = true;
    ninjaStars += 3;
    healingPotions += 1;
    strengthElixirs += 2;
    messageText.textContent = "You got 3 ninja stars, 1 healing potion, and 2 strength elixirs";
    messageText2.textContent = "A giant came out of the forest!";
    updateInventoryUI();
  } else if (enemyKey === "giant") {
    if (!giantDefeated && !iceDragonActive && !dragonRevealInProgress) {
      giantDefeated = true;
      dragonRevealInProgress = true;
      document.getElementById("gameDiv").style.display = "none";
      const title = document.getElementById("titleText");
      title.textContent = "You won!";
      setTimeout(() => { title.textContent = "."; }, 2000);
      setTimeout(() => { title.textContent = ".."; }, 4000);
      setTimeout(() => { title.textContent = "..."; }, 6000);
      setTimeout(() => { title.textContent = "Not..."; }, 8000);
      setTimeout(() => { title.textContent = "THE ICE DRAGON"; }, 12000);
      setTimeout(() => {
        document.getElementById("gameDiv").style.display = "";
        shake2();
        document.body.style.filter = "invert(1)";
        title.style.filter = "invert(1)";
        title.style.color = "white";
        messageText2.textContent = "The Ice Dragon challenges you!";
        messageText.textContent = "You got 4 ninja stars, 2 healing potions, and 2 strength elixirs";
        ninjaStars += 4;
        healingPotions += 2;
        strengthElixirs += 2;
        updateInventoryUI();
        iceDragonActive = true;
        dragonRevealInProgress = false;
        updateEnemyDisplay();
      }, 12000);
    }
  }
}

function enemyAttackOnce() {
  if (hasRustyShield) {
    const shieldBreak = Math.floor(Math.random() * 3) + 1;
    if (shieldBreak === 1) {
      messageText2.textContent = "Your shield broke!";
      hasRustyShield = false;
    } else {
      messageText2.textContent = "Your shield blocked damage!";
      return;
    }
  }
  const k = activeEnemyKey();
  if (k === "goblin" && goblinHealth > 0) {
    const dmg = Math.floor(Math.random() * 3) + 8;
    playerHealth -= dmg;
    messageText2.textContent = "Goblin did " + dmg + " damage!";
    if (goblinHealth <= 0 && !goblinDefeated) grantOnKillRewards("goblin");
  } else if (k === "orc" && orcHealth > 0) {
    const dmg = Math.floor(Math.random() * 3) + 10;
    playerHealth -= dmg;
    messageText2.textContent = "Orc did " + dmg + " damage!";
    if (orcHealth <= 0 && !orcDefeated) grantOnKillRewards("orc");
  } else if (k === "giant" && giantHealth > 0) {
    const dmg = Math.floor(Math.random() * 14) + 7;
    playerHealth -= dmg;
    messageText2.textContent = "Giant did " + dmg + " damage!";
    if (giantHealth <= 0 && !giantDefeated) grantOnKillRewards("giant");
  } else if (k === "dragon" && iceDragonHealth > 0) {
    const dmg = Math.floor(Math.random() * 8) + 29;
    playerHealth -= dmg;
    messageText2.textContent = "Ice Dragon did " + dmg + " damage!";
    if (iceDragonHealth <= 0 && !iceDragonDefeated) {
      iceDragonDefeated = true;
    }
  }
}

function enemyTurn() {
  if (dragonRevealInProgress) return;
  if(iceDragonActive) {
    document.body.style.backgroundColor = "lightblue"
  }
  if (goblinHealth <= 0 && !goblinDefeated) grantOnKillRewards("goblin");
  if (orcHealth <= 0 && !orcDefeated) grantOnKillRewards("orc");
  if (giantHealth <= 0 && !giantDefeated && !iceDragonActive) grantOnKillRewards("giant");
  enemyAttackOnce();

  if (abyssDrakeActive && abyssDrakeTurnsRemaining > 0) {
    abyssDrakeTurnsRemaining--;
    if (abyssDrakeTurnsRemaining <= 0) {
      abyssDrakeActive = false;
      messageText.textContent = "Abyss Drake has been killed by the enemy";
    }
  }
  if (miniHydraActive && miniHydraTurnsRemaining > 0) {
    miniHydraTurnsRemaining--;
    if (miniHydraTurnsRemaining <= 0) {
      miniHydraActive = false;
      messageText.textContent = "Mini Hydra has been killed by the enemy";
    }
  }
  if (magicWolfActive && magicWolfTurnsRemaining > 0) {
    magicWolfTurnsRemaining--;
    if (magicWolfTurnsRemaining <= 0) {
      magicWolfActive = false;
      messageText.textContent = "Magic Wolf has been killed by the enemy";
    }
  }
  updatePlayerDisplay();
  updateEnemyDisplay();
}

function physMultiplier(base) {
  let m = base;
  if (hasStrengthElixir) m *= 3;
  if (miniHydraActive) m *= 2;
  return m;
}

function spellMultiplier(base) {
  let m = base;
  if (magicWolfActive) m *= 2;
  return m;
}

function disableFor(btn, ms) {
  btn.style.backgroundColor = "gray";
  btn.style.cursor = "not-allowed";
  btn.disabled = true;
  setTimeout(() => {
    btn.style.backgroundColor = "";
    btn.style.cursor = "";
    btn.disabled = false;
  }, ms);
}

fightButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  let playerDamage = Math.floor(Math.random() * 4) + 20;
  playerDamage = physMultiplier(playerDamage);
  applyDamageToActiveEnemy(playerDamage);
  messageText.textContent = "You dealt " + playerDamage + " damage!";
  hasStrengthElixir = false;
  updateInventoryUI();
  updateEnemyDisplay();
  enemyTurn();
  shake();
  flashBody("flash-background-red");
});

itemButton.addEventListener("click", function () {
  itemButtonsRow.style.display = "flex";
  magicButtonsRow.style.display = "none";
  summonButtonsRow.style.display = "none";
  divider.style.width = "92%";
});

magicButton.addEventListener("click", function () {
  itemButtonsRow.style.display = "none";
  magicButtonsRow.style.display = "flex";
  summonButtonsRow.style.display = "none";
  divider.style.width = "96%";
});

summonButton.addEventListener("click", function () {
  itemButtonsRow.style.display = "none";
  magicButtonsRow.style.display = "none";
  summonButtonsRow.style.display = "flex";
  divider.style.width = "54%";
});

healingPotionButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  if (healingPotions < 1) return;
  playerHealth += 200;
  healingPotions -= 1;
  messageText.textContent = "You healed 200 health!";
  updateInventoryUI();
  updatePlayerDisplay();
  enemyTurn();
  flashBody("flash-background-purple");
});

ninjaStarButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  if (ninjaStars < 1) return;
  const dmg = hasStrengthElixir ? 90 : 30;
  applyDamageToActiveEnemy(dmg);
  ninjaStars -= 1;
  messageText.textContent = "Your ninja star did " + dmg + " damage!";
  hasStrengthElixir = false;
  updateInventoryUI();
  updateEnemyDisplay();
  updatePlayerDisplay();
  enemyTurn();
  shake();
  flashBody("flash-background-red");
});

strengthElixirButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  if (strengthElixirs < 1) return;
  hasStrengthElixir = true;
  strengthElixirs -= 1;
  messageText.textContent = "Your physical damage will be tripled next turn!";
  updateInventoryUI();
  enemyTurn();
  flashBody("flash-background-orange");
});

rustyShieldButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  hasRustyShield = true;
  setBtnEnabled(rustyShieldButton, false);
  enemyTurn();
  flashBody("flash-background-brown");
});

fireballButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  const hit = Math.floor(Math.random() * 10) < 6;
  if (hit) {
    const dmg = spellMultiplier(80);
    applyDamageToActiveEnemy(dmg);
    messageText.textContent =
      activeEnemyKey() === "dragon"
        ? "Your fireball hit the Ice Dragon and did " + dmg + " damage!"
        : "Your fireball hit and did " + dmg + " damage!";
    shake();
    flashBody("flash-background-red");
  } else {
    messageText.textContent = "Your fireball missed and did no damage.";
  }
  disableFor(fireballButton, 8000);
  updateEnemyDisplay();
  enemyTurn();
});

thunderclapButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  const hit = Math.floor(Math.random() * 10) < 4;
  if (hit) {
    const dmg = spellMultiplier(140);
    applyDamageToActiveEnemy(dmg);
    messageText.textContent =
      activeEnemyKey() === "dragon"
        ? "Your thunderclap hit the Ice Dragon and did " + dmg + " damage!"
        : "Your thunderclap hit and did " + dmg + " damage!";
    shake();
    flashBody("flash-background-yellow");
  } else {
    messageText.textContent = "Your thunderclap missed and did no damage.";
  }
  disableFor(thunderclapButton, 8000);
  updateEnemyDisplay();
  enemyTurn();
});

shadowVortexButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  const hit = Math.floor(Math.random() * 4) + 1 === 4;
  let baseDmg = abyssDrakeActive ? 800 : 200;
  let baseHeal = abyssDrakeActive ? 200 : 40;
  if (hit) {
    const dmg = spellMultiplier(baseDmg);
    applyDamageToActiveEnemy(dmg);
    playerHealth += baseHeal;
    messageText.textContent =
      activeEnemyKey() === "dragon"
        ? "Your shadow vortex hit the Ice Dragon and did " + dmg + " damage! You healed " + baseHeal + " health"
        : "Your shadow vortex hit and did " + dmg + " damage! You healed " + baseHeal + " health";
    shake();
    flashBody("flash-background-purple");
  } else {
    messageText.textContent = "Your shadow vortex missed and did no damage.";
  }
  disableFor(shadowVortexButton, 8000);
  updatePlayerDisplay();
  updateEnemyDisplay();
  enemyTurn();
});

iceRainButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  const miss = Math.floor(Math.random() * 4) + 1 === 1;
  if (miss) {
    messageText.textContent = "Your ice rain missed and did no damage";
  } else {
    if (activeEnemyKey() === "dragon") {
      messageText.textContent = "The Ice Dragon is immune to ice rain!";
    } else {
      const dmg = spellMultiplier(25);
      applyDamageToActiveEnemy(dmg);
      messageText.textContent = "Your ice rain hit and did " + dmg + " damage!";
      shake();
      flashBody("flash-background-blue");
    }
  }
  disableFor(iceRainButton, 8000);
  enemyTurn();
  updateEnemyDisplay();
});

abyssDrakeButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  if (abyssDrakeActive) return;
  abyssDrakeActive = true;
  abyssDrakeTurnsRemaining = 4;
  messageText.textContent = "Abyss Drake has been summoned! It will enhance your Shadow Vortex for 4 turns.";
  flashBody("flash-background-purple", 400);
  setBtnEnabled(abyssDrakeButton, false);
  setTimeout(() => setBtnEnabled(abyssDrakeButton, true), 40000);
  enemyTurn();
  updateEnemyDisplay();
  updatePlayerDisplay();
});

miniHydraButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  if (miniHydraActive) return;
  miniHydraActive = true;
  miniHydraTurnsRemaining = 8;
  messageText.textContent = "Mini Hydra has been summoned! It will aid you when you fight for 8 turns!";
  flashBody("flash-background-white", 400);
  setBtnEnabled(miniHydraButton, false);
  setTimeout(() => setBtnEnabled(miniHydraButton, true), 40000);
  enemyTurn();
  updateEnemyDisplay();
  updatePlayerDisplay();
});

magicWolfButton.addEventListener("click", function () {
  if (dragonRevealInProgress) return;
  if (magicWolfActive) return;
  magicWolfActive = true;
  magicWolfTurnsRemaining = 6;
  messageText.textContent = "Magic Wolf has been summoned! It will double your spell damage for 6 turns!";
  flashBody("flash-background-yellow", 400);
  setBtnEnabled(magicWolfButton, false);
  setTimeout(() => setBtnEnabled(magicWolfButton, true), 40000);
  enemyTurn();
  updateEnemyDisplay();
  updatePlayerDisplay();
});

updateEnemyDisplay();
updatePlayerDisplay();
updateInventoryUI();
