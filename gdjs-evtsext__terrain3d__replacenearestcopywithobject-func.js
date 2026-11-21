
if (typeof gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject !== "undefined") {
  gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject = {};
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects2= [];
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects3= [];
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1= [];
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects2= [];
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects3= [];


gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.mapOfGDgdjs_9546evtsExt_9595_9595Terrain3D_9595_9595ReplaceNearestCopyWithObject_9546GDObjectToCreateObjects1Objects = Hashtable.newFrom({"ObjectToCreate": gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1});
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("EraseTheCopy");
}
if (isConditionTrue_0) {
gdjs.copyArray(gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1, gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects2);

{for(var i = 0, len = gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects2.length ;i < len;++i) {
    gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects2[i].EraseCopies(eventsFunctionContext.localVariables[0].getFromIndex(0).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(1).getAsNumber(), 1, eventsFunctionContext);
}
}
}

}


{


let isConditionTrue_0 = false;
{
/* Reuse gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1 */
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1.length = 0;

{gdjs.evtTools.object.createObjectOnScene(eventsFunctionContext, gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.mapOfGDgdjs_9546evtsExt_9595_9595Terrain3D_9595_9595ReplaceNearestCopyWithObject_9546GDObjectToCreateObjects1Objects, eventsFunctionContext.localVariables[0].getFromIndex(0).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(1).getAsNumber(), (( gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length === 0 ) ? "" :gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1[0].getLayer()));
}
{for(var i = 0, len = gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("Object3DBehavior")).setZ(eventsFunctionContext.localVariables[0].getFromIndex(2).getAsNumber());
}
}
{for(var i = 0, len = gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1[i].setAngle(eventsFunctionContext.localVariables[0].getFromIndex(3).getAsNumber());
}
}
{for(var i = 0, len = gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1.length ;i < len;++i) {
    gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1[i].getBehavior(eventsFunctionContext.getBehaviorName("ScaleBehavior")).setScale(eventsFunctionContext.localVariables[0].getFromIndex(4).getAsNumber());
}
}
}

}


};gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (eventsFunctionContext.localVariables[0].getFromIndex(4).getAsNumber() > 0);
}
if (isConditionTrue_0) {

{ //Subevents
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}

}


};gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.eventsList2 = function(runtimeScene, eventsFunctionContext) {

{


{
const variables = new gdjs.VariablesContainer();
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("CopyX", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("CopyY", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("CopyZ", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("CopyAngle", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("CopyScale", variable);
}
eventsFunctionContext.localVariables.push(variables);
}
let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("ScatterObject"), gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1);
{eventsFunctionContext.localVariables[0].getFromIndex(0).setNumber((( gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1[0].NearestCopyX(eventsFunctionContext.getArgument("X"), eventsFunctionContext.getArgument("Y"), eventsFunctionContext)));
}
{eventsFunctionContext.localVariables[0].getFromIndex(1).setNumber((( gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1[0].NearestCopyY(eventsFunctionContext.getArgument("X"), eventsFunctionContext.getArgument("Y"), eventsFunctionContext)));
}
{eventsFunctionContext.localVariables[0].getFromIndex(2).setNumber((( gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1[0].NearestCopyZ(eventsFunctionContext.localVariables[0].getFromIndex(0).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(1).getAsNumber(), eventsFunctionContext)));
}
{eventsFunctionContext.localVariables[0].getFromIndex(3).setNumber((( gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1[0].NearestCopyAngle(eventsFunctionContext.localVariables[0].getFromIndex(0).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(1).getAsNumber(), eventsFunctionContext)));
}
{eventsFunctionContext.localVariables[0].getFromIndex(4).setNumber((( gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1[0].NearestCopyScale(eventsFunctionContext.localVariables[0].getFromIndex(0).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(1).getAsNumber(), eventsFunctionContext)));
}

{ //Subevents
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.eventsList1(runtimeScene, eventsFunctionContext);} //End of subevents
}
eventsFunctionContext.localVariables.pop();

}


};

gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.func = function(runtimeScene, ScatterObject, ObjectToCreate, Object3DBehavior, ScaleBehavior, X, Y, EraseTheCopy, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
"ScatterObject": ScatterObject
, "ObjectToCreate": ObjectToCreate
},
  _objectArraysMap: {
"ScatterObject": gdjs.objectsListsToArray(ScatterObject)
, "ObjectToCreate": gdjs.objectsListsToArray(ObjectToCreate)
},
  _behaviorNamesMap: {
"Object3DBehavior": Object3DBehavior
, "ScaleBehavior": ScaleBehavior
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
if (argName === "EraseTheCopy") return EraseTheCopy;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects3.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects2.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects3.length = 0;

gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.eventsList2(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDScatterObjectObjects3.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects2.length = 0;
gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.GDObjectToCreateObjects3.length = 0;


return;
}

gdjs.evtsExt__Terrain3D__ReplaceNearestCopyWithObject.registeredGdjsCallbacks = [];