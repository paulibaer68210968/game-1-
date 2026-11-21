gdjs.Match3Code = {};
gdjs.Match3Code.localVariables = [];
gdjs.Match3Code.idToCallbackMap = new Map();
gdjs.Match3Code.GDTile_9595RedObjects1= [];
gdjs.Match3Code.GDTile_9595RedObjects2= [];
gdjs.Match3Code.GDTile_9595RedObjects3= [];
gdjs.Match3Code.GDTile_9595RedObjects4= [];
gdjs.Match3Code.GDTile_9595BlueObjects1= [];
gdjs.Match3Code.GDTile_9595BlueObjects2= [];
gdjs.Match3Code.GDTile_9595BlueObjects3= [];
gdjs.Match3Code.GDTile_9595BlueObjects4= [];
gdjs.Match3Code.GDTile_9595GreenObjects1= [];
gdjs.Match3Code.GDTile_9595GreenObjects2= [];
gdjs.Match3Code.GDTile_9595GreenObjects3= [];
gdjs.Match3Code.GDTile_9595GreenObjects4= [];
gdjs.Match3Code.GDTile_9595YellowObjects1= [];
gdjs.Match3Code.GDTile_9595YellowObjects2= [];
gdjs.Match3Code.GDTile_9595YellowObjects3= [];
gdjs.Match3Code.GDTile_9595YellowObjects4= [];
gdjs.Match3Code.GDTile_9595PurpleObjects1= [];
gdjs.Match3Code.GDTile_9595PurpleObjects2= [];
gdjs.Match3Code.GDTile_9595PurpleObjects3= [];
gdjs.Match3Code.GDTile_9595PurpleObjects4= [];
gdjs.Match3Code.GDMovesTextObjects1= [];
gdjs.Match3Code.GDMovesTextObjects2= [];
gdjs.Match3Code.GDMovesTextObjects3= [];
gdjs.Match3Code.GDMovesTextObjects4= [];
gdjs.Match3Code.GDGoalTextObjects1= [];
gdjs.Match3Code.GDGoalTextObjects2= [];
gdjs.Match3Code.GDGoalTextObjects3= [];
gdjs.Match3Code.GDGoalTextObjects4= [];
gdjs.Match3Code.GDStarsTextObjects1= [];
gdjs.Match3Code.GDStarsTextObjects2= [];
gdjs.Match3Code.GDStarsTextObjects3= [];
gdjs.Match3Code.GDStarsTextObjects4= [];
gdjs.Match3Code.GDMessageTextObjects1= [];
gdjs.Match3Code.GDMessageTextObjects2= [];
gdjs.Match3Code.GDMessageTextObjects3= [];
gdjs.Match3Code.GDMessageTextObjects4= [];
gdjs.Match3Code.GDBackButtonObjects1= [];
gdjs.Match3Code.GDBackButtonObjects2= [];
gdjs.Match3Code.GDBackButtonObjects3= [];
gdjs.Match3Code.GDBackButtonObjects4= [];
gdjs.Match3Code.GD_9595RedGemSourceObjects1= [];
gdjs.Match3Code.GD_9595RedGemSourceObjects2= [];
gdjs.Match3Code.GD_9595RedGemSourceObjects3= [];
gdjs.Match3Code.GD_9595RedGemSourceObjects4= [];


gdjs.Match3Code.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.storage.elementExistsInJSONFile("SaveData", "Level");
if (isConditionTrue_0) {
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "Level", runtimeScene, gdjs.Match3Code.localVariables[0].getFromIndex(0));
}
{runtimeScene.getScene().getVariables().getFromIndex(1).setNumber(gdjs.Match3Code.localVariables[0].getFromIndex(0).getAsNumber());
}
}

}


};gdjs.Match3Code.eventsList1 = function(runtimeScene) {
{

let elseEventsChainSatisfied = false;

{


elseEventsChainSatisfied = false;
let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(1).getAsNumber() == 2);
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setString("Blue");
}
elseEventsChainSatisfied = true;
}

}


{


if (!elseEventsChainSatisfied) {
let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(1).getAsNumber() == 3);
}
if (!elseEventsChainSatisfied && isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setString("Green");
}
elseEventsChainSatisfied = true;
}
}

}


{


if (!elseEventsChainSatisfied) {
let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(1).getAsNumber() == 4);
}
if (!elseEventsChainSatisfied && isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setString("Yellow");
}
elseEventsChainSatisfied = true;
}
}

}


{


if (!elseEventsChainSatisfied) {
let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(1).getAsNumber() >= 5);
}
if (!elseEventsChainSatisfied && isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setString("Purple");
}
elseEventsChainSatisfied = true;
}
}

}

}

};gdjs.Match3Code.mapOfGDgdjs_9546Match3Code_9546GDTile_95959595RedObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595BlueObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595GreenObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595YellowObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595PurpleObjects2Objects = Hashtable.newFrom({"Tile_Red": gdjs.Match3Code.GDTile_9595RedObjects2, "Tile_Blue": gdjs.Match3Code.GDTile_9595BlueObjects2, "Tile_Green": gdjs.Match3Code.GDTile_9595GreenObjects2, "Tile_Yellow": gdjs.Match3Code.GDTile_9595YellowObjects2, "Tile_Purple": gdjs.Match3Code.GDTile_9595PurpleObjects2});
gdjs.Match3Code.userFunc0xe4b300 = function GDJSInlineCode(runtimeScene, objects) {
"use strict";
  const vars = runtimeScene.getVariables();
  if (vars.get("GameState").getAsString() !== "idle") return;
  const clicked = objects[0];
  if (!clicked) return;
  const names = ["Tile_Red", "Tile_Blue", "Tile_Green", "Tile_Yellow", "Tile_Purple"];
  const all = [];
  for (const n of names) for (const t of runtimeScene.getObjects(n)) all.push(t);
  const gx = (t) => t.getVariables().get("GridX").getAsNumber();
  const gy = (t) => t.getVariables().get("GridY").getAsNumber();
  const place = (t) => { t.setX(384 + gx(t) * 64); t.setY(88 + gy(t) * 64); };
  for (const t of all) t.setOpacity(255);
  const cx = gx(clicked), cy = gy(clicked);
  const sx = vars.get("SelectedX").getAsNumber();
  const sy = vars.get("SelectedY").getAsNumber();
  if (sx < 0 || cx === sx && cy === sy) {
    if (sx < 0 || cx !== sx || cy !== sy) {
      vars.get("SelectedX").setNumber(cx);
      vars.get("SelectedY").setNumber(cy);
      clicked.setOpacity(160);
    } else {
      vars.get("SelectedX").setNumber(-1);
    }
    return;
  }
  if (Math.abs(cx - sx) + Math.abs(cy - sy) !== 1) {
    vars.get("SelectedX").setNumber(cx);
    vars.get("SelectedY").setNumber(cy);
    clicked.setOpacity(160);
    return;
  }
  const a = all.find((t) => gx(t) === sx && gy(t) === sy);
  if (!a) { vars.get("SelectedX").setNumber(-1); return; }
  // Tausch durchführen
  a.getVariables().get("GridX").setNumber(cx);
  a.getVariables().get("GridY").setNumber(cy);
  clicked.getVariables().get("GridX").setNumber(sx);
  clicked.getVariables().get("GridY").setNumber(sy);
  place(a);
  place(clicked);
  vars.get("SwapAX").setNumber(sx);
  vars.get("SwapAY").setNumber(sy);
  vars.get("SwapBX").setNumber(cx);
  vars.get("SwapBY").setNumber(cy);
  vars.get("SelectedX").setNumber(-1);
  vars.get("Busy").setBoolean(true);
  vars.get("GameState").setString("resolve");
};
gdjs.Match3Code.eventsList2 = function(runtimeScene) {

{

/* Reuse gdjs.Match3Code.GDTile_9595BlueObjects2 */
/* Reuse gdjs.Match3Code.GDTile_9595GreenObjects2 */
/* Reuse gdjs.Match3Code.GDTile_9595PurpleObjects2 */
/* Reuse gdjs.Match3Code.GDTile_9595RedObjects2 */
/* Reuse gdjs.Match3Code.GDTile_9595YellowObjects2 */

const objects = [];
objects.push.apply(objects,gdjs.Match3Code.GDTile_9595RedObjects2);
objects.push.apply(objects,gdjs.Match3Code.GDTile_9595BlueObjects2);
objects.push.apply(objects,gdjs.Match3Code.GDTile_9595GreenObjects2);
objects.push.apply(objects,gdjs.Match3Code.GDTile_9595YellowObjects2);
objects.push.apply(objects,gdjs.Match3Code.GDTile_9595PurpleObjects2);
gdjs.Match3Code.userFunc0xe4b300(runtimeScene, objects);

}


};gdjs.Match3Code.userFunc0x12f00f0 = function GDJSInlineCode(runtimeScene) {
"use strict";
  const vars = runtimeScene.getVariables();
  const names = ["Tile_Red", "Tile_Blue", "Tile_Green", "Tile_Yellow", "Tile_Purple"];
  const all = [];
  for (const n of names) for (const t of runtimeScene.getObjects(n)) all.push(t);
  const W = 8, H = 8, OX = 384, OY = 88, CS = 64;
  const gx = (t) => t.getVariables().get("GridX").getAsNumber();
  const gy = (t) => t.getVariables().get("GridY").getAsNumber();
  const place = (t) => { t.setX(OX + gx(t) * CS); t.setY(OY + gy(t) * CS); };
  const grid = Array.from({ length: H }, () => Array(W).fill(null));
  for (const t of all) {
    const x = gx(t), y = gy(t);
    if (x >= 0 && x < W && y >= 0 && y < H) grid[y][x] = t;
  }
  const nameOf = (t) => t.getName();
  const findMatches = () => {
    const m = new Set();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = grid[y][x];
      if (!t) continue;
      const n = nameOf(t);
      if (x + 2 < W && grid[y][x + 1] && grid[y][x + 2] && nameOf(grid[y][x + 1]) === n && nameOf(grid[y][x + 2]) === n) {
        m.add(t); m.add(grid[y][x + 1]); m.add(grid[y][x + 2]);
      }
      if (y + 2 < H && grid[y + 1][x] && grid[y + 2][x] && nameOf(grid[y + 1][x]) === n && nameOf(grid[y + 2][x]) === n) {
        m.add(t); m.add(grid[y + 1][x]); m.add(grid[y + 2][x]);
      }
    }
    return m;
  };
  let matches = findMatches();
  if (matches.size === 0) {
    // Zug war ungültig: zurücktauschen
    const ax = vars.get("SwapAX").getAsNumber(), ay = vars.get("SwapAY").getAsNumber();
    const bx = vars.get("SwapBX").getAsNumber(), by = vars.get("SwapBY").getAsNumber();
    const tileA = grid[by][bx], tileB = grid[ay][ax];
    if (tileA && tileB) {
      tileA.getVariables().get("GridX").setNumber(ax);
      tileA.getVariables().get("GridY").setNumber(ay);
      tileB.getVariables().get("GridX").setNumber(bx);
      tileB.getVariables().get("GridY").setNumber(by);
      place(tileA);
      place(tileB);
    }
    vars.get("Busy").setBoolean(false);
    vars.get("GameState").setString("idle");
    return;
  }
  // Zug gültig: einen Zug abziehen und Kaskaden auflösen
  vars.get("MovesLeft").setNumber(vars.get("MovesLeft").getAsNumber() - 1);
  const goalColor = vars.get("GoalColor").getAsString();
  let guard = 0;
  while (matches.size > 0 && guard++ < 50) {
    for (const t of matches) {
      if (nameOf(t) === "Tile_" + goalColor) {
        vars.get("GoalCollected").setNumber(vars.get("GoalCollected").getAsNumber() + 1);
      }
      t.deleteFromScene();
    }
    for (let x = 0; x < W; x++) {
      let writeY = H - 1;
      for (let y = H - 1; y >= 0; y--) {
        const t = grid[y][x];
        if (t) {
          if (y !== writeY) {
            grid[writeY][x] = t;
            grid[y][x] = null;
            t.getVariables().get("GridY").setNumber(writeY);
            place(t);
          }
          writeY--;
        }
      }
      for (let y = writeY; y >= 0; y--) {
        const n = names[Math.floor(Math.random() * names.length)];
        const t = runtimeScene.createObject(n);
        if (!t) continue;
        t.setWidth(64);
        t.setHeight(64);
        t.getVariables().get("GridX").setNumber(x);
        t.getVariables().get("GridY").setNumber(y);
        t.setX(OX + x * CS);
        t.setY(OY + y * CS);
        grid[y][x] = t;
      }
    }
    matches = findMatches();
  }
  vars.get("Busy").setBoolean(false);
  vars.get("SelectedX").setNumber(-1);
  const gc = vars.get("GoalCollected").getAsNumber();
  const gn = vars.get("GoalNeeded").getAsNumber();
  if (gc >= gn) {
    const gameVars = runtimeScene.getGame().getVariables();
    gameVars.get("Stars").setNumber(gameVars.get("Stars").getAsNumber() + 1);
    vars.get("Level").setNumber(vars.get("Level").getAsNumber() + 1);
    vars.get("GameState").setString("won");
  } else if (vars.get("MovesLeft").getAsNumber() <= 0) {
    vars.get("GameState").setString("lost");
  } else {
    vars.get("GameState").setString("idle");
  }
};
gdjs.Match3Code.eventsList3 = function(runtimeScene) {

{


gdjs.Match3Code.userFunc0x12f00f0(runtimeScene);

}


};gdjs.Match3Code.asyncCallback17956812 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.Match3Code.localVariables);
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game Scene", false);
}
gdjs.Match3Code.localVariables.length = 0;
}
gdjs.Match3Code.idToCallbackMap.set(17956812, gdjs.Match3Code.asyncCallback17956812);
gdjs.Match3Code.eventsList4 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.Match3Code.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(2), (runtimeScene) => (gdjs.Match3Code.asyncCallback17956812(runtimeScene, asyncObjectsList)), 17956812, asyncObjectsList);
}
}

}


};gdjs.Match3Code.asyncCallback17958764 = function (runtimeScene, asyncObjectsList) {
asyncObjectsList.restoreLocalVariablesContainers(gdjs.Match3Code.localVariables);
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game Scene", false);
}
gdjs.Match3Code.localVariables.length = 0;
}
gdjs.Match3Code.idToCallbackMap.set(17958764, gdjs.Match3Code.asyncCallback17958764);
gdjs.Match3Code.eventsList5 = function(runtimeScene) {

{


{
{
const asyncObjectsList = new gdjs.LongLivedObjectsList();
asyncObjectsList.backupLocalVariablesContainers(gdjs.Match3Code.localVariables);
runtimeScene.getAsyncTasksManager().addTask(gdjs.evtTools.runtimeScene.wait(2), (runtimeScene) => (gdjs.Match3Code.asyncCallback17958764(runtimeScene, asyncObjectsList)), 17958764, asyncObjectsList);
}
}

}


};gdjs.Match3Code.eventsList6 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("BackButton"), gdjs.Match3Code.GDBackButtonObjects2);
{runtimeScene.getScene().getVariables().getFromIndex(8).setString("idle");
}
{runtimeScene.getScene().getVariables().getFromIndex(5).setNumber(20);
}
{runtimeScene.getScene().getVariables().getFromIndex(2).setNumber(0);
}
{runtimeScene.getScene().getVariables().getFromIndex(3).setNumber(12 + runtimeScene.getScene().getVariables().getFromIndex(1).getAsNumber() * 3);
}
{runtimeScene.getScene().getVariables().getFromIndex(7).setNumber(-1);
}
{runtimeScene.getScene().getVariables().getFromIndex(6).setNumber(-1);
}
{runtimeScene.getScene().getVariables().getFromIndex(0).setBoolean(false);
}
{for(var i = 0, len = gdjs.Match3Code.GDBackButtonObjects2.length ;i < len;++i) {
    gdjs.Match3Code.GDBackButtonObjects2[i].SetLabelTextOp(runtimeScene.getGame().getVariables().getFromIndex(1).getChild("Garden").getChild(runtimeScene.getGame().getVariables().getFromIndex(2).getAsString()).getAsString(), null);
}
}

{ //Subevents
gdjs.Match3Code.eventsList1(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("GoalText"), gdjs.Match3Code.GDGoalTextObjects2);
gdjs.copyArray(runtimeScene.getObjects("MovesText"), gdjs.Match3Code.GDMovesTextObjects2);
gdjs.copyArray(runtimeScene.getObjects("StarsText"), gdjs.Match3Code.GDStarsTextObjects2);
{for(var i = 0, len = gdjs.Match3Code.GDMovesTextObjects2.length ;i < len;++i) {
    gdjs.Match3Code.GDMovesTextObjects2[i].getBehavior("Text").setText(runtimeScene.getGame().getVariables().getFromIndex(1).getChild("Moves").getChild(runtimeScene.getGame().getVariables().getFromIndex(2).getAsString()).getAsString() + ": " + gdjs.evtTools.common.toString(runtimeScene.getScene().getVariables().getFromIndex(5).getAsNumber()));
}
}
{for(var i = 0, len = gdjs.Match3Code.GDGoalTextObjects2.length ;i < len;++i) {
    gdjs.Match3Code.GDGoalTextObjects2[i].getBehavior("Text").setText(runtimeScene.getGame().getVariables().getFromIndex(1).getChild("Collect").getChild(runtimeScene.getGame().getVariables().getFromIndex(2).getAsString()).getAsString() + " " + runtimeScene.getScene().getVariables().getFromIndex(4).getAsString() + ": " + gdjs.evtTools.common.toString(runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber()) + " / " + gdjs.evtTools.common.toString(runtimeScene.getScene().getVariables().getFromIndex(3).getAsNumber()));
}
}
{for(var i = 0, len = gdjs.Match3Code.GDStarsTextObjects2.length ;i < len;++i) {
    gdjs.Match3Code.GDStarsTextObjects2[i].getBehavior("Text").setText(runtimeScene.getGame().getVariables().getFromIndex(1).getChild("Stars").getChild(runtimeScene.getGame().getVariables().getFromIndex(2).getAsString()).getAsString() + ": " + gdjs.evtTools.common.toString(runtimeScene.getGame().getVariables().getFromIndex(3).getAsNumber()));
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Tile_Blue"), gdjs.Match3Code.GDTile_9595BlueObjects2);
gdjs.copyArray(runtimeScene.getObjects("Tile_Green"), gdjs.Match3Code.GDTile_9595GreenObjects2);
gdjs.copyArray(runtimeScene.getObjects("Tile_Purple"), gdjs.Match3Code.GDTile_9595PurpleObjects2);
gdjs.copyArray(runtimeScene.getObjects("Tile_Red"), gdjs.Match3Code.GDTile_9595RedObjects2);
gdjs.copyArray(runtimeScene.getObjects("Tile_Yellow"), gdjs.Match3Code.GDTile_9595YellowObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(8).getAsString() == "idle");
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.Match3Code.mapOfGDgdjs_9546Match3Code_9546GDTile_95959595RedObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595BlueObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595GreenObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595YellowObjects2ObjectsGDgdjs_9546Match3Code_9546GDTile_95959595PurpleObjects2Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
}
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.Match3Code.eventsList2(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(8).getAsString() == "resolve");
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.Match3Code.eventsList3(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(8).getAsString() == "idle");
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(17950684);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.storage.writeNumberInJSONFile("SaveData", "MovesLeft", runtimeScene.getScene().getVariables().getFromIndex(5).getAsNumber());
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(8).getAsString() == "won");
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(17950580);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("MessageText"), gdjs.Match3Code.GDMessageTextObjects2);
{for(var i = 0, len = gdjs.Match3Code.GDMessageTextObjects2.length ;i < len;++i) {
    gdjs.Match3Code.GDMessageTextObjects2[i].getBehavior("Text").setText(runtimeScene.getGame().getVariables().getFromIndex(1).getChild("Win").getChild(runtimeScene.getGame().getVariables().getFromIndex(2).getAsString()).getAsString());
}
}
{gdjs.evtTools.storage.writeNumberInJSONFile("SaveData", "Stars", runtimeScene.getGame().getVariables().getFromIndex(3).getAsNumber());
}
{gdjs.evtTools.storage.writeNumberInJSONFile("SaveData", "Level", runtimeScene.getScene().getVariables().getFromIndex(1).getAsNumber());
}
{gdjs.evtTools.storage.writeNumberInJSONFile("SaveData", "MovesLeft", 20);
}

{ //Subevents
gdjs.Match3Code.eventsList4(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(8).getAsString() == "lost");
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(17957924);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("MessageText"), gdjs.Match3Code.GDMessageTextObjects2);
{for(var i = 0, len = gdjs.Match3Code.GDMessageTextObjects2.length ;i < len;++i) {
    gdjs.Match3Code.GDMessageTextObjects2[i].getBehavior("Text").setText(runtimeScene.getGame().getVariables().getFromIndex(1).getChild("NoMoves").getChild(runtimeScene.getGame().getVariables().getFromIndex(2).getAsString()).getAsString());
}
}

{ //Subevents
gdjs.Match3Code.eventsList5(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("BackButton"), gdjs.Match3Code.GDBackButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.Match3Code.GDBackButtonObjects1.length;i<l;++i) {
    if ( gdjs.Match3Code.GDBackButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs.Match3Code.GDBackButtonObjects1[k] = gdjs.Match3Code.GDBackButtonObjects1[i];
        ++k;
    }
}
gdjs.Match3Code.GDBackButtonObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game Scene", false);
}
}

}


};gdjs.Match3Code.eventsList7 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (gdjs.Match3Code.localVariables[0].getFromIndex(0).getAsNumber() > 0);
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(5).setNumber(gdjs.Match3Code.localVariables[0].getFromIndex(0).getAsNumber());
}
}

}


};gdjs.Match3Code.eventsList8 = function(runtimeScene) {

{


{
const variables = new gdjs.VariablesContainer();
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("LoadedLevel", variable);
}
gdjs.Match3Code.localVariables.push(variables);
}
let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {

{ //Subevents
gdjs.Match3Code.eventsList0(runtimeScene);} //End of subevents
}
gdjs.Match3Code.localVariables.pop();

}


{


gdjs.Match3Code.eventsList6(runtimeScene);
}


{


{
const variables = new gdjs.VariablesContainer();
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("LoadedMoves", variable);
}
gdjs.Match3Code.localVariables.push(variables);
}
let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.storage.elementExistsInJSONFile("SaveData", "MovesLeft");
}
if (isConditionTrue_0) {
{gdjs.evtTools.storage.readNumberFromJSONFile("SaveData", "MovesLeft", runtimeScene, gdjs.Match3Code.localVariables[0].getFromIndex(0));
}

{ //Subevents
gdjs.Match3Code.eventsList7(runtimeScene);} //End of subevents
}
gdjs.Match3Code.localVariables.pop();

}


};

gdjs.Match3Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.Match3Code.GDTile_9595RedObjects1.length = 0;
gdjs.Match3Code.GDTile_9595RedObjects2.length = 0;
gdjs.Match3Code.GDTile_9595RedObjects3.length = 0;
gdjs.Match3Code.GDTile_9595RedObjects4.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects1.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects2.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects3.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects4.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects1.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects2.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects3.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects4.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects1.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects2.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects3.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects4.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects1.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects2.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects3.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects4.length = 0;
gdjs.Match3Code.GDMovesTextObjects1.length = 0;
gdjs.Match3Code.GDMovesTextObjects2.length = 0;
gdjs.Match3Code.GDMovesTextObjects3.length = 0;
gdjs.Match3Code.GDMovesTextObjects4.length = 0;
gdjs.Match3Code.GDGoalTextObjects1.length = 0;
gdjs.Match3Code.GDGoalTextObjects2.length = 0;
gdjs.Match3Code.GDGoalTextObjects3.length = 0;
gdjs.Match3Code.GDGoalTextObjects4.length = 0;
gdjs.Match3Code.GDStarsTextObjects1.length = 0;
gdjs.Match3Code.GDStarsTextObjects2.length = 0;
gdjs.Match3Code.GDStarsTextObjects3.length = 0;
gdjs.Match3Code.GDStarsTextObjects4.length = 0;
gdjs.Match3Code.GDMessageTextObjects1.length = 0;
gdjs.Match3Code.GDMessageTextObjects2.length = 0;
gdjs.Match3Code.GDMessageTextObjects3.length = 0;
gdjs.Match3Code.GDMessageTextObjects4.length = 0;
gdjs.Match3Code.GDBackButtonObjects1.length = 0;
gdjs.Match3Code.GDBackButtonObjects2.length = 0;
gdjs.Match3Code.GDBackButtonObjects3.length = 0;
gdjs.Match3Code.GDBackButtonObjects4.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects1.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects2.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects3.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects4.length = 0;

gdjs.Match3Code.eventsList8(runtimeScene);
gdjs.Match3Code.GDTile_9595RedObjects1.length = 0;
gdjs.Match3Code.GDTile_9595RedObjects2.length = 0;
gdjs.Match3Code.GDTile_9595RedObjects3.length = 0;
gdjs.Match3Code.GDTile_9595RedObjects4.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects1.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects2.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects3.length = 0;
gdjs.Match3Code.GDTile_9595BlueObjects4.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects1.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects2.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects3.length = 0;
gdjs.Match3Code.GDTile_9595GreenObjects4.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects1.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects2.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects3.length = 0;
gdjs.Match3Code.GDTile_9595YellowObjects4.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects1.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects2.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects3.length = 0;
gdjs.Match3Code.GDTile_9595PurpleObjects4.length = 0;
gdjs.Match3Code.GDMovesTextObjects1.length = 0;
gdjs.Match3Code.GDMovesTextObjects2.length = 0;
gdjs.Match3Code.GDMovesTextObjects3.length = 0;
gdjs.Match3Code.GDMovesTextObjects4.length = 0;
gdjs.Match3Code.GDGoalTextObjects1.length = 0;
gdjs.Match3Code.GDGoalTextObjects2.length = 0;
gdjs.Match3Code.GDGoalTextObjects3.length = 0;
gdjs.Match3Code.GDGoalTextObjects4.length = 0;
gdjs.Match3Code.GDStarsTextObjects1.length = 0;
gdjs.Match3Code.GDStarsTextObjects2.length = 0;
gdjs.Match3Code.GDStarsTextObjects3.length = 0;
gdjs.Match3Code.GDStarsTextObjects4.length = 0;
gdjs.Match3Code.GDMessageTextObjects1.length = 0;
gdjs.Match3Code.GDMessageTextObjects2.length = 0;
gdjs.Match3Code.GDMessageTextObjects3.length = 0;
gdjs.Match3Code.GDMessageTextObjects4.length = 0;
gdjs.Match3Code.GDBackButtonObjects1.length = 0;
gdjs.Match3Code.GDBackButtonObjects2.length = 0;
gdjs.Match3Code.GDBackButtonObjects3.length = 0;
gdjs.Match3Code.GDBackButtonObjects4.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects1.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects2.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects3.length = 0;
gdjs.Match3Code.GD_9595RedGemSourceObjects4.length = 0;


return;

}

gdjs['Match3Code'] = gdjs.Match3Code;
