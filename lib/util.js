function Util() {
}

Util.contain = function(arr, key, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key].toString() == value.toString()) {
      return true;
    }
  }
  return false;
}
// GameData.ships = {
//   marine: {'name': 'marine', 'hp': 1000, 'weaponAttSLot': 3, 'weaponDefSlot': 3, 'upgrade': 0},
//   blackPear: {'name': 'blackPear', 'hp': 4000, 'weaponAttSLot': 4, 'weaponDefSlot': 4, 'upgrade': 0},
//   thunder: {'name': 'thunder', 'hp': 2000, 'weaponAttSLot': 4, 'weaponDefSlot': 4, 'upgrade': 0}
// };

// GameData.weapons = {
//   bomb: {'name': 'bomb', 'damage': 60, 'slotType': 'attack', 'upgrade': 0},
//   missile: {'name': 'missile', 'damage': 100, 'slotType': 'attack', 'upgrade': 0},
//   gun: {'name': 'gun', 'damage': 45, 'slotType': 'attack', 'upgrade': 0},
//   missileDef: {'name': 'missileDef', 'damage': 100, 'slotType': 'defend', 'upgrade': 0}
// };

// GameData.weapons = [
//   {'id': 0, 'name': 'bomb', 'damage': 60, 'slotType': 'attack', 'upgrade': 0},
//   {'id': 5, 'name': 'missile', 'damage': 100, 'slotType': 'attack', 'upgrade': 0},
//   {'id': 10, 'name': 'gun', 'damage': 45, 'slotType': 'attack', 'upgrade': 0},
//   {'id': 15, 'name': 'missileDef', 'damage': 100, 'slotType': 'defend', 'upgrade': 0}
// ];

module.exports = Util;