'use strict';

// Character.js:
// This file defines the class that stores all the
// information about a D&D character and functions
// for accessing and calculating certain information.
//
// This file also contains various utility functions
// pertaining to the Character class for the
// application.

// Used for accessing the file system
import fs from 'fs';

var currentDirectory = './resources/app/';
if (process.env.NODE_ENV === 'dev') {
  currentDirectory = './test/';
}
export const CURR_DIR = currentDirectory;

export const CHARACTER_MAP_PATH = CURR_DIR + 'character_map.json';                                  // character map
export const CHARACTER_DIR = CURR_DIR + 'Characters/';                                              // saved characters

var dbLocation = CURR_DIR + 'lib/db/';
if (process.env.NODE_ENV === 'dev') {
  dbLocation = './lib/db/';
}
const DB_LOCATION = dbLocation;

export const SPELLS_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'spellsDB.json'));                // spells database
export const ITEMS_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'itemsDB.json'));                  // items database
export const WEAPONS_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'weaponsDB.json'));              // weapons database
export const ARMOR_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'armorDB.json'));                  // armor database
export const RACES_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'racesDB.json'));                  // race database
export const BACKGROUNDS_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'backgroundsDB.json'));      // backgrounds database
export const FEATURE_TRAITS_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'featureTraitsDB.json')); // features and traits database
export const CLASSES_DB = JSON.parse(fs.readFileSync(DB_LOCATION + 'classesDB.json')).classes;      // classes database

// List of skills organized by ability they are
// associated with
export const SKILLS = JSON.parse(fs.readFileSync(DB_LOCATION + 'skillsDB.json'));
export const SPELL_CLASSES = JSON.parse(fs.readFileSync(DB_LOCATION + 'spellClassDB.json'));

// Character class that contains the information for
// a D&D character.
//
// Also contains the functions for saving and
// reading in a character from a JSON file.
export default class Character {
  constructor(path) {
    // decide if we are creating a new character, if so
    // initialize a default, if not import it
    if (path === 'NEW_CHARACTER') {
      this.createDefaultCharacter();
    } else if (path.split('\\').length > 1 || path.split('/').length > 1) {
      this.importFromJSON(path);
    } else {
      this.importFromJSON(CHARACTER_DIR + path);
    }

    this.updateAutoValues = this.updateAutoValues.bind(this);
  }

  // Go through the spells database and retrieve spells
  // that match one of the classes and the spell level
  //
  // spellClasses: array of D&D spell casting classes
  // spellLevel: level of spell
  getListOfSpells(spellClasses, spellLevel) {
    var validSpells = [];
    for (let i = 0; i < SPELLS_DB.length; i++) {
      // if we match one class and the spell level, add the
      // spell to the list
      var levelMatch = false;
      var classMatch = false;

      for (let j = 0; j < SPELLS_DB[i].tags.length; j++) {
        for (let k = 0; k < spellClasses.length; k++) {
          classMatch = spellClasses[k].toLowerCase() === SPELLS_DB[i].tags[j];
        }

        if (spellLevel === SPELLS_DB[i].tags[j]) {
          levelMatch = true;
        }
      }

      // if both the level and class match, add the spell
      // to the list
      if (levelMatch && classMatch) {
        validSpells.push(SPELLS_DB[i]);
      }
    }

    return validSpells;
  }
  // Go through the information stored in the data and
  // make sure that it has been set as something
  //
  // data: javascript object containing character
  //   information
  validateLoadedCharacter(data) {
    if (data.name === undefined) {
      throw 'No character name';
    }
    if (data.playerName === undefined) {
      throw 'No player name';
    }
    if (data.classes === undefined || data.classes.length === 0) {
      throw 'No classes';
    }
    if (data.race === undefined) {
      throw 'No race';
    }
    if (data.alignment === undefined) {
      throw 'No alignment';
    }
    if (data.experience === undefined) {
      throw 'No experience';
    }
    if (data.background === undefined) {
      throw 'No background';
    }
    if (data.personalityTraits === undefined) {
      throw 'No personality traits';
    }
    if (data.ideals === undefined) {
      throw 'No ideals';
    }
    if (data.bonds === undefined) {
      throw 'No bonds';
    }
    if (data.flaws === undefined) {
      throw 'No flaws';
    }
    if (data.abilityScores === undefined) {
      throw 'No ability scores';
    }
    if (data.abilityScores.strength === undefined) {
      throw 'No strength ability scores';
    }
    if (data.abilityScores.dexterity === undefined) {
      throw 'No dexterity ability scores';
    }
    if (data.abilityScores.constitution === undefined) {
      throw 'No constitution ability scores';
    }
    if (data.abilityScores.intelligence === undefined) {
      throw 'No intelligence ability scores';
    }
    if (data.abilityScores.wisdom === undefined) {
      throw 'No wisdom ability scores';
    }
    if (data.abilityScores.charisma === undefined) {
      throw 'No charisma ability scores';
    }
    if (data.inspiration === undefined) {
      throw 'No inspiration';
    }
    if (data.savingThrows === undefined) {
      throw 'No saving throws';
    }
    if (data.savingThrows.strength === undefined || data.savingThrows.strength.proficient === undefined) {
      throw 'No strength saving throw';
    }
    if (data.savingThrows.dexterity === undefined || data.savingThrows.dexterity.proficient === undefined) {
      throw 'No dexterity saving throw';
    }
    if (data.savingThrows.constitution === undefined || data.savingThrows.constitution.proficient === undefined) {
      throw 'No constitution saving throw';
    }
    if (data.savingThrows.intelligence === undefined || data.savingThrows.intelligence.proficient === undefined) {
      throw 'No intelligence saving throw';
    }
    if (data.savingThrows.wisdom === undefined || data.savingThrows.wisdom.proficient === undefined) {
      throw 'No wisdom saving throw';
    }
    if (data.savingThrows.charisma === undefined || data.savingThrows.charisma.proficient === undefined) {
      throw 'No charisma saving throw';
    }
    if (data.skills === undefined) {
      throw 'No skills';
    }
    if (data.skills.acrobatics === undefined || data.skills.acrobatics.proficient === undefined) {
      throw 'No acrobatic skills';
    }
    if (data.skills.animalHandling === undefined || data.skills.animalHandling.proficient === undefined) {
      throw 'No animalHandling skills';
    }
    if (data.skills.arcana === undefined || data.skills.arcana.proficient === undefined) {
      throw 'No arcana skills';
    }
    if (data.skills.athletics === undefined || data.skills.athletics.proficient === undefined) {
      throw 'No athletics skills';
    }
    if (data.skills.deception === undefined || data.skills.deception.proficient === undefined) {
      throw 'No deception skills';
    }
    if (data.skills.history === undefined || data.skills.history.proficient === undefined) {
      throw 'No history skills';
    }
    if (data.skills.insight === undefined || data.skills.insight.proficient === undefined) {
      throw 'No insight skills';
    }
    if (data.skills.intimidation === undefined || data.skills.intimidation.proficient === undefined) {
      throw 'No intimidation skills';
    }
    if (data.skills.investigation === undefined || data.skills.investigation.proficient === undefined) {
      throw 'No investigation skills';
    }
    if (data.skills.medicine === undefined || data.skills.medicine.proficient === undefined) {
      throw 'No medicine skills';
    }
    if (data.skills.nature === undefined || data.skills.nature.proficient === undefined) {
      throw 'No nature skills';
    }
    if (data.skills.perception === undefined || data.skills.perception.proficient === undefined) {
      throw 'No perception skills';
    }
    if (data.skills.performance === undefined || data.skills.performance.proficient === undefined) {
      throw 'No performance skills';
    }
    if (data.skills.persuasion === undefined || data.skills.persuasion.proficient === undefined) {
      throw 'No persuasion skills';
    }
    if (data.skills.religion === undefined || data.skills.religion.proficient === undefined) {
      throw 'No religion skills';
    }
    if (data.skills.sleightOfHand === undefined || data.skills.sleightOfHand.proficient === undefined) {
      throw 'No sleightOfHand skills';
    }
    if (data.skills.stealth === undefined || data.skills.stealth.proficient === undefined) {
      throw 'No stealth skills';
    }
    if (data.skills.survival === undefined || data.skills.survival.proficient === undefined) {
      throw 'No survival skills';
    }
    if (data.hitpoints === undefined) {
      throw 'No hitpoints';
    }
    if (data.hitpoints.maximum === undefined) {
      throw 'No hitpoint maximum';
    }
    if (data.hitpoints.current === undefined) {
      throw 'No current hitpoints';
    }
    if (data.hitpoints.temporary === undefined) {
      throw 'No temporary hitpoints';
    }
    if (data.speed === undefined) {
      throw 'No speed';
    }
    if (data.hitDice === undefined) {
      throw 'No hit dice';
    }
    if (data.deathSaves === undefined) {
      throw 'No death saves';
    }
    if (data.deathSaves.successes === undefined) {
      throw 'No death saves';
    }
    if (data.deathSaves.failures === undefined) {
      throw 'No death saves';
    }
    if (data.weapons === undefined) {
      throw 'No weapons';
    }
    if (data.inventory === undefined) {
      throw 'No inventory';
    }
    if (data.armor === undefined) {
      throw 'No armor';
    }
    if (data.currency === undefined) {
      throw 'No currency';
    }
    if (data.currency.platinum === undefined) {
      throw 'No platinum currency';
    }
    if (data.currency.gold === undefined) {
      throw 'No gold currency';
    }
    if (data.currency.electrum === undefined) {
      throw 'No electrum currency';
    }
    if (data.currency.silver === undefined) {
      throw 'No silver currency';
    }
    if (data.currency.copper === undefined) {
      throw 'No copper currency';
    }
    if (data.featuresAndTraits === undefined) {
      throw 'No features and traits';
    }
    if (data.proficienciesAndLanguages === undefined) {
      throw 'No proficienciesAndLanguages';
    }
    if (data.spellCastingClass === undefined) {
      throw 'No spellcasting class';
    }
    if (data.spells === undefined) {
      throw 'No spells';
    }
  }

  // Reads in a character from a JSON file and creates
  // the js object for that character
  //
  // path: the file path to the character
  importFromJSON(path) {
    var data = JSON.parse(fs.readFileSync(path));
    this.validateLoadedCharacter(data);
    this.name = data.name;
    this.originalName = this.name;
    this.playerName = data.playerName;
    this.classes = data.classes;
    this.calculateProficiencyBonus();

    this.race = data.race;

    this.calculateLabel();

    this.alignment = data.alignment;
    this.experience = data.experience;
    this.background = data.background;
    this.personalityTraits = data.personalityTraits;
    this.ideals = data.ideals;
    this.bonds = data.bonds;
    this.flaws = data.flaws;
    this.abilityScores = data.abilityScores;

    this.abilityScoreMods = {};

    this.calculateAbilityMods();

    this.inspiration = data.inspiration;
    this.savingThrows = data.savingThrows;

    this.calculateSavingThrows();

    this.skills = data.skills;

    this.calculateSkills();
    this.passiveWisdom = 10 + this.skills.perception.value;
    this.hitpoints = data.hitpoints;

    this.initiative = this.abilityScoreMods.dexterity;

    this.speed = data.speed;
    this.hitDice = data.hitDice;
    this.deathSaves = data.deathSaves;
    this.weapons = data.weapons;
    this.inventory = data.inventory;
    this.armor = data.armor;

    this.calculateArmorClass();

    this.currency = data.currency;
    this.featuresAndTraits = data.featuresAndTraits;
    this.proficienciesAndLanguages = data.proficienciesAndLanguages;
    this.spellCastingClass = data.spellCastingClass;
    this.calculateSpellValues();
    this.spells = data.spells;
  }

  // Calculate the label used on the character
  // selection screen
  calculateLabel() {
    this.label = this.name + ' - ' + this.race;
    for (let i = 0; i < this.classes.length; i++) {
      this.label += ' - ' + this.classes[i].name + ' ' + this.classes[i].level;
    }
  }

  // Calculate the character's ability score mods
  calculateAbilityMods() {
    this.abilityScoreMods.strength = Math.floor((this.abilityScores.strength - 10)/2);
    this.abilityScoreMods.dexterity = Math.floor((this.abilityScores.dexterity - 10)/2);
    this.abilityScoreMods.constitution = Math.floor((this.abilityScores.constitution - 10)/2);
    this.abilityScoreMods.intelligence = Math.floor((this.abilityScores.intelligence - 10)/2);
    this.abilityScoreMods.wisdom = Math.floor((this.abilityScores.wisdom - 10)/2);
    this.abilityScoreMods.charisma = Math.floor((this.abilityScores.charisma - 10)/2);
}

  // Calculate the character's saving throws
  calculateSavingThrows() {
    this.savingThrows.strength.value = this.savingThrows.strength.proficient
      ? this.abilityScoreMods.strength + this.proficiencyBonus
      : this.abilityScoreMods.strength;
    this.savingThrows.dexterity.value = this.savingThrows.dexterity.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;
    this.savingThrows.constitution.value = this.savingThrows.constitution.proficient
      ? this.abilityScoreMods.constitution + this.proficiencyBonus
      : this.abilityScoreMods.constitution;
    this.savingThrows.intelligence.value = this.savingThrows.intelligence.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;
    this.savingThrows.wisdom.value = this.savingThrows.wisdom.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;
    this.savingThrows.charisma.value = this.savingThrows.charisma.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;
  }

  // Calculate the value for each of the character's
  // skills
  calculateSkills() {
    this.skills.acrobatics.value = this.skills.acrobatics.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.animalHandling.value = this.skills.animalHandling.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.arcana.value = this.skills.arcana.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.athletics.value = this.skills.athletics.proficient
      ? this.abilityScoreMods.strength + this.proficiencyBonus
      : this.abilityScoreMods.strength;

    this.skills.deception.value = this.skills.deception.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.history.value = this.skills.history.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.insight.value = this.skills.insight.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.intimidation.value = this.skills.intimidation.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.investigation.value = this.skills.investigation.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.medicine.value = this.skills.medicine.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.nature.value = this.skills.nature.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.perception.value = this.skills.perception.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.performance.value = this.skills.performance.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.persuasion.value = this.skills.persuasion.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.religion.value = this.skills.religion.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.sleightOfHand.value = this.skills.sleightOfHand.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.stealth.value = this.skills.stealth.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.survival.value = this.skills.survival.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;
  }

  // Calculate the character's armor class
  calculateArmorClass() {
    this.armorClass = 0;
    for (let i = 0; i < this.armor.length; i++) {
      let armorObject = findArmor(this.armor[i]);
      this.armorClass += armorObject.armorClass;
      switch (armorObject.armorType) {
        case 'light':
          this.armorClass += this.abilityScoreMods.dexterity;
          break;
        case 'medium':
          this.armorClass += this.abilityScoreMods.dexterity <= 2
            ? this.abilityScoreMods.dexterity
            : 2;
          break;
        case 'heavy':
          // potential to auto reduce speed in here
          break;
        case 'shield':
          break;
        default:
          console.log('Error in armor type');
          break;
      }
    }
  }

  // Calculate the character's spell save DC and spell
  // attack modifier
  calculateSpellValues() {
    switch (this.spellCastingClass) {
      case 'Bard':
      case 'Paladin':
      case 'Sorcerer':
      case 'Warlock':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.charisma;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.charisma;
        break;
      case 'Cleric (trickery)':
      case 'Cleric':
      case 'Druid':
      case 'Ranger':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.wisdom;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.wisdom;
        break;
      case 'Wizard':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.intelligence;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.intelligence;
        break;
      case 'None':
        //Do nothing, since there are no values to edit
        this.spellSaveDC = 0;
        this.spellAttackMod = 0;
        break;
      default:
        console.log('Error in spell casting class');
        break;
    }
  }

  // Calculate the character's effective character
  // level (the sum of all class levels)
  calculateEffectiveCharacterLevel() {
    this.effectiveClassLevel = 0;
    for (let i = 0; i < this.classes.length; i++) {
      this.effectiveClassLevel += parseInt(this.classes[i].level);
    }
  }

  // Calculate the character's proficiency bonus
  calculateProficiencyBonus() {
    this.calculateEffectiveCharacterLevel();
    this.proficiencyBonus = Math.floor((this.effectiveClassLevel-1)/4) + 2;
  }

  // Recalculate all auto calculated values for
  // the character
  updateAutoValues() {
    if (this.name !== undefined && this.race !== undefined) {
      this.calculateLabel();
    }
    this.calculateAbilityMods();
    this.calculateProficiencyBonus();
    this.initiative = this.abilityScoreMods.dexterity;
    this.calculateSavingThrows();
    this.calculateSkills();
    this.passiveWisdom = 10 + this.skills.perception.value;
    this.calculateArmorClass();
    this.calculateSpellValues();
  }

  // Save all essential information in the js character
  // object and store it in a JSON file
  //
  // path: file path of character
  saveCharacter(path) {
    var char = {};
    char.name = this.name;
    char.playerName = this.playerName;
    char.classes = this.classes;
    char.race = this.race;
    char.alignment = this.alignment;
    char.experience = this.experience;
    char.background = this.background;
    char.personalityTraits = this.personalityTraits;
    char.ideals = this.ideals;
    char.bonds = this.bonds;
    char.flaws = this.flaws;
    char.abilityScores = this.abilityScores;
    char.inspiration = this.inspiration;
    char.proficiencyBonus = this.proficiencyBonus;
    char.savingThrows = {
      strength:{proficient:this.savingThrows.strength.proficient},
      dexterity:{proficient:this.savingThrows.dexterity.proficient},
      constitution:{proficient:this.savingThrows.constitution.proficient},
      intelligence:{proficient:this.savingThrows.intelligence.proficient},
      wisdom:{proficient:this.savingThrows.wisdom.proficient},
      charisma:{proficient:this.savingThrows.charisma.proficient}
    };
    char.skills = {
      acrobatics:{proficient:this.skills.acrobatics.proficient},
      animalHandling:{proficient:this.skills.animalHandling.proficient},
      arcana:{proficient:this.skills.arcana.proficient},
      athletics:{proficient:this.skills.athletics.proficient},
      deception:{proficient:this.skills.deception.proficient},
      history:{proficient:this.skills.history.proficient},
      insight:{proficient:this.skills.insight.proficient},
      intimidation:{proficient:this.skills.intimidation.proficient},
      investigation:{proficient:this.skills.investigation.proficient},
      medicine:{proficient:this.skills.medicine.proficient},
      nature:{proficient:this.skills.nature.proficient},
      perception:{proficient:this.skills.perception.proficient},
      performance:{proficient:this.skills.performance.proficient},
      persuasion:{proficient:this.skills.persuasion.proficient},
      religion:{proficient:this.skills.religion.proficient},
      sleightOfHand:{proficient:this.skills.sleightOfHand.proficient},
      stealth:{proficient:this.skills.stealth.proficient},
      survival:{proficient:this.skills.survival.proficient}
    };
    char.hitpoints = this.hitpoints;
    char.speed = this.speed;
    char.hitDice = this.hitDice;
    char.deathSaves = this.deathSaves;
    char.weapons = this.weapons;
    char.inventory = this.inventory;
    char.armor = this.armor;
    char.currency = this.currency;
    char.featuresAndTraits = this.featuresAndTraits;
    char.proficienciesAndLanguages= this.proficienciesAndLanguages;
    char.spellCastingClass = this.spellCastingClass;
    char.spells = this.spells;

    if (this.originalName !== this.name && fs.existsSync(CHARACTER_DIR + this.originalName + '.json')) {
      fs.unlink(CHARACTER_DIR + this.originalName + '.json');
    }
    javascriptObjectToJSONFile(path, char);
  }

  // Check if a character is saveable (a character must
  // have a name, class, and race)
  isCharacterValid() {
    if (this.name === undefined || this.name === '') {
      return false;
    } else if (this.classes.length === 0) {
      return false;
    } else if (this.race === undefined || this.race === '') {
      return false;
    }

    if (this.originalName !== this.name) {
      var files = fs.readdirSync(CHARACTER_DIR);
      for (let i = 0; i < files.length; i++) {
        if (this.name + '.json' === files[i]) {
          return false;
        }
      }
    }

    return true;
  }

  // Create a default character with no information
  createDefaultCharacter() {
    this.name = '';
    this.originalName = this.name;
    this.playerName = '';
    this.classes = [];
    this.effectiveCharacterLevel = 0;
    this.proficiencyBonus = 0;
    this.race = '';
    this.label = '';
    this.alignment = ['',''];
    this.experience = 0;
    this.background = '';
    this.personalityTraits = '';
    this.ideals = '';
    this.bonds = '';
    this.flaws = '';
    this.abilityScores = {
      strength:10,
      dexterity:10,
      constitution:10,
      intelligence:10,
      wisdom:10,
      charisma:10
    };
    this.abilityScoreMods = {
      strength:0,
      dexterity:0,
      constitution:0,
      intelligence:0,
      wisdom:0,
      charisma:0
    };
    this.inspiration = 0;
    this.savingThrows = {
      strength:{proficient:false},
      dexterity:{proficient:false},
      constitution:{proficient:false},
      intelligence:{proficient:false},
      wisdom:{proficient:false},
      charisma:{proficient:false}
    };
    this.skills = {
      acrobatics: {proficient:false},
      animalHandling: {proficient:false},
      arcana: {proficient:false},
      athletics: {proficient:false},
      deception: {proficient:false},
      history: {proficient:false},
      insight: {proficient:false},
      intimidation: {proficient:false},
      investigation: {proficient:false},
      medicine: {proficient:false},
      nature: {proficient:false},
      perception: {proficient:false},
      performance: {proficient:false},
      persuasion: {proficient:false},
      religion: {proficient:false},
      sleightOfHand: {proficient:false},
      stealth: {proficient:false},
      survival: {proficient:false},
    };
    this.passiveWisdom = 10;
    this.hitpoints = {
      current:0,
      maximum:0,
      temporary:0
    };
    this.initiative = 0;
    this.speed = 30;
    this.hitDice = '';
    this.deathSaves = {
      successes:0,
      failures:0
    };
    this.currency = {
      platinum: 0,
      gold: 0,
      electrum: 0,
      silver: 0,
      copper: 0
    };
    this.weapons = [];
    this.inventory = [];
    this.armor = [];
    this.money = 0;
    this.featuresAndTraits = [];
    this.proficienciesAndLanguages = [];
    this.spellCastingClass = 'None';
    this.spells = [];
    this.updateAutoValues();
  }
}

// Write a JavaScript object to a JSON file
//
// path: the file path we are writing to
// object: the js object to export
export function javascriptObjectToJSONFile(path, object) {
  try {
    fs.writeFileSync(path, JSON.stringify(object, null, 2));
  } catch (e) {
    console.log('Error in writing file');
  }
}

// Parse the JSON character map
export function readMap() {
  var map = {};

  // if the map doesn't exist, create one
  if (!fs.existsSync(CHARACTER_MAP_PATH)) {
    javascriptObjectToJSONFile(CHARACTER_MAP_PATH, {});
  }

  try {
    map = JSON.parse(fs.readFileSync(CHARACTER_MAP_PATH)).map;
  } catch (e) {
    console.log('Error in reading map');
  }
  return map;
}

// Read the characters from a given character map
//
// map: character map
export function readCharactersFromMap(map) {
  var characters = [];
  for (let i = 0; i < map.length; i++) {
    characters.push(
      new Character(map[i].filename)
    );
  }
  return characters;
}

// Export and save the charater map from an array of
// characters
//
// characterDirectory: a directory that holds characters
export function exportMap() {
  var map = [];
  var characters = [];

  // create character directory if it does not exist
  if (!fs.existsSync(CHARACTER_DIR)) {
    fs.mkdirSync(CHARACTER_DIR);
  }
  var characterFiles = fs.readdirSync(CHARACTER_DIR);

  // import character files as JSON
  for (var i in characterFiles) {
    var fileLen = characterFiles[i].length;
    var extension = characterFiles[i].substring(fileLen-5);
    if (extension === '.json') {
      var c = JSON.parse(fs.readFileSync(CHARACTER_DIR + characterFiles[i]));
      characters.push(c);
    }
  }

  // create entries for the character map
  for (let i = 0; i < characters.length; i++) {
    var charToExport = {};
    charToExport.filename  = characters[i].name + '.json';
    charToExport.label = characters[i].name + ' - ' + characters[i].race;
    for (let j = 0; j < characters[i].classes.length; j++) {
      charToExport.label += ' - ' + characters[i].classes[j].name + ' ' + characters[i].classes[j].level;
    }
    charToExport.classes = characters[i].classes;
    charToExport.race = characters[i].race;
    map.push(charToExport);
  }

  javascriptObjectToJSONFile(CHARACTER_MAP_PATH, {map});
}

// Load characters from one or more JSON files and
// export a new character map
//
// paths: an array of paths to JSON files defining
//   characters to be loaded
export function loadCharacters(paths) {
  try {
    var charToLoad = new Character(paths[0]);
    return charToLoad;
  } catch (e) {
    console.log(e);
    return null;
  }
}

// Delete character from list of characters
//
// fileName: file location and name of character
// cb: callback function
export function deleteCharacter(fileName, cb) {
  if (fs.existsSync(CHARACTER_DIR + fileName)) {
    fs.unlink(CHARACTER_DIR + fileName);
  }
  cb();
}

// Finds and returns a spell based on its name
//
// spellName: String of name
export function findSpell(spellName) {
  for (let i = 0; i < SPELLS_DB.length; i++) {
    if (spellName === SPELLS_DB[i].name) {
      return SPELLS_DB[i];
    }
  }
  return null;
}

// Finds and returns item based on its name
//
// itemName: String of name
export function findItem(itemName) {
  for (let i = 0; i < ITEMS_DB.length; i++) {
    if (itemName === ITEMS_DB[i].name) {
      return ITEMS_DB[i];
    }
  }
  return null;
}

// Finds and returns armor based on its name
//
// armorName: String of name
export function findArmor(armorName) {
  for (let i = 0; i < ARMOR_DB.length; i++) {
    if (armorName === ARMOR_DB[i].name) {
      return ARMOR_DB[i];
    }
  }
  return null;
}

// Finds and returns weapon based on its name
//
// weaponName: String of name
export function findWeapon(weaponName) {
  for (let i = 0; i < WEAPONS_DB.length; i++) {
    if (weaponName === WEAPONS_DB[i].name) {
      return WEAPONS_DB[i];
    }
  }
  return null;
}

// Finds and returns features and traits based on
// its name
//
// featureName: String of name
export function findFeature(featureName) {
  for (let i = 0; i < FEATURE_TRAITS_DB.length; i++) {
    if (featureName === FEATURE_TRAITS_DB[i].name) {
      return FEATURE_TRAITS_DB[i];
    }
  }
  return null;
}
