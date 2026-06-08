import {bridgeRestCallGet, bridgeRestCallPost, bridgeRestCallPut, bridgeRestCallPatch, bridgeRestCallDelete } from './REST/restCall';
// trace and track function ////////////////////////////////////////////////////////////////////////////////////
export async function bridgeCallPriority(bridgeName:string, bridgeSettings: any, restCallType:string, requestParams: any, requestBody: any) {
let responseData:any;
    //check call pririty
    if(bridgeSettings?.callPriority === 'High') {
      // Handle high-priority POST call
      responseData = await restCallSwitching(restCallType, bridgeName, bridgeSettings, requestParams, requestBody);
    }
    if(bridgeSettings?.callPriority === 'Medium') {
      // Handle medium-priority POST call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds before making the call
      responseData = await restCallSwitching(restCallType, bridgeName, bridgeSettings, requestParams, requestBody);
    }
    if(bridgeSettings?.callPriority === 'Low') {
      // Handle low-priority POST call
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before making the call
      responseData = await restCallSwitching(restCallType, bridgeName, bridgeSettings, requestParams, requestBody);
    }
    return responseData;  
}

export async function bridgeCallRetry(bridgeName:string, bridgeSettings: any, restType:string, requestParams: any, requestBody: any) {
  let responseData:any;
   console.log(`Bridge Info: Retrying ${restType} API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await restCallSwitching(restType, bridgeName, bridgeSettings, requestParams, requestBody);
        retryCount++;
      }
    return responseData;  
}
async function restCallSwitching(restType:string, bridgeName:string, bridgeSettings: any, requestParams: any, requestBody: any) {
  let responseData:any;
  switch(restType) {
    case 'GET':
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
      break;
    case 'POST':
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
      break;
    case 'PUT':
      responseData = await bridgeRestCallPut(bridgeName, bridgeSettings, requestParams, requestBody);
      break;
    case 'PATCH':
      responseData = await bridgeRestCallPatch(bridgeName, bridgeSettings, requestParams, requestBody);
      break;
    case 'DELETE':
      responseData = await bridgeRestCallDelete(bridgeName, bridgeSettings, requestParams, requestBody);
      break;
  }
  return responseData;

}
  