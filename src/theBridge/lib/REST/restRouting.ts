import {bridgeRestCallGet, bridgeRestCallPost, bridgeRestCallPut, bridgeRestCallPatch, bridgeRestCallDelete } from './restCall';


  export async function restPostRouting(bridgeName:string, bridgeSettings: any, requestParams: any, requestBody: any)
    {
      let responseData:any;
    //check call pririty
    if(bridgeSettings?.callPriority === 'High') {
      // Handle high-priority POST call
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
    }
    if(bridgeSettings?.callPriority === 'Medium') {
      // Handle medium-priority POST call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds before making the call
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
    }
    if(bridgeSettings?.callPriority === 'Low') {
      // Handle low-priority POST call
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before making the call
      responseData = await bridgeRestCallPost(bridgeName, bridgeSettings, requestParams, requestBody);
    }
        
    
    
    if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
      console.log(`Bridge Info: Retrying POST API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await bridgeRestCallGet( bridgeName, bridgeSettings, requestParams);
        retryCount++;
      }
    }
      return responseData;
  }
export async function restGetRouting(bridgeName:string, bridgeSettings: any, requestParams: any)
{
let responseData:any;
if(bridgeSettings?.callPriority === 'High') {
      // Handle high-priority GET call
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
    }
    if(bridgeSettings?.callPriority === 'Medium') {
      // Handle medium-priority GET call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds before making the call
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
    }
    if(bridgeSettings?.callPriority === 'Low') {
      // Handle low-priority GET call
      await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 5 seconds before making the call
      responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
    }
    if(!responseData && bridgeSettings?.retrySettings?.retry === 'active')    {
      console.log(`Bridge Info: Retrying GET API call. Attempt ${bridgeSettings?.retrySettings?.retryCount}`);
      let retryCount = 0;
      while(retryCount < bridgeSettings?.retrySettings?.retryCount && !responseData) {
        //console.log('bridgeRestCallGet retrying... Attempt:', retryCount + 1);        
        // Wait for bridgeSettings?.retrySettings?.retryDelay before making the call
        await new Promise(resolve => setTimeout(resolve, bridgeSettings?.retrySettings?.retryDelay));        
        responseData = await bridgeRestCallGet(bridgeName, bridgeSettings, requestParams);
        retryCount++;
      }
    }

    return responseData;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
